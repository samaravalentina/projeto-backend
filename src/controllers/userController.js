const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

function pickUserPublic(userInstance) {
  if (!userInstance) return null;
  const { id, firstname, surname, email } = userInstance;
  return { id, firstname, surname, email };
}

module.exports = {
  async getById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: ["id", "firstname", "surname", "email"],
      });

      if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar usuário.", error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { firstname, surname, email, password, confirmPassword } = req.body;

      if (!firstname || !surname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Preencha firstname, surname, email, password e confirmPassword." });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "confirmPassword não confere com password." });
      }

      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const created = await User.create({
        firstname,
        surname,
        email,
        password: passwordHash,
      });

      return res.status(201).json(pickUserPublic(created));
    } catch (err) {
      return res.status(500).json({
        message: "Erro ao criar usuário.",
        error: err.message,
        details: err.errors?.map((e) => ({
          message: e.message,
          path: e.path,
          value: e.value,
          validatorKey: e.validatorKey,
        })),
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { firstname, surname, email } = req.body;

      if (firstname === undefined && surname === undefined && email === undefined) {
        return res.status(400).json({ message: "Envie ao menos um campo para atualizar (firstname, surname, email)." });
      }

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

      if (firstname !== undefined) user.firstname = firstname;
      if (surname !== undefined) user.surname = surname;
      if (email !== undefined) user.email = email;

      await user.save();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar usuário.", error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

      await user.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ message: "Erro ao deletar usuário.", error: err.message });
    }
  },

  async token(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Informe email e password." });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Credenciais inválidas." });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(400).json({ message: "Credenciais inválidas." });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ message: "JWT_SECRET não configurado no .env" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: "1d" }
      );

      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao gerar token.", error: err.message });
    }
  },
};
