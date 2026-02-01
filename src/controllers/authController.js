const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function token(req, res) {
  try {
    const { email, password } = req.body;

    // validação mínima (edital pede 400 quando dados incorretos)
    if (!email || !password) {
      return res.status(400).json({ message: "Email e password são obrigatórios." });
    }

    const user = await User.findOne({ where: { email } });

    // se não achou usuário, também 400 (pra não revelar se existe ou não)
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
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

module.exports = { token };
