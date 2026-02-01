"use strict";

const { Op } = require("sequelize");
const Category = require("../models/category");

/**
 * Criar categoria
 */
async function create(req, res) {
  try {
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "name e slug são obrigatórios." });
    }

    const exists = await Category.findOne({ where: { slug } });
    if (exists) {
      return res.status(400).json({ message: "Slug já cadastrado." });
    }

    const category = await Category.create({
      name,
      slug,
      use_in_menu: !!use_in_menu,
    });

    return res.status(201).json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

/**
 * Buscar categoria por ID
 */
async function getById(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    return res.status(200).json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

/**
 * Buscar categorias (com filtro + paginação)
 */
async function search(req, res) {
  try {
    const { name, slug, use_in_menu, page = 1, limit = 12 } = req.query;

    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (slug) where.slug = slug;
    if (use_in_menu !== undefined) where.use_in_menu = use_in_menu === "true";

    const offset = (page - 1) * limit;

    const { rows, count } = await Category.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      data: rows,
      total: count,
      limit: Number(limit),
      page: Number(page),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

/**
 * Atualizar categoria
 */
async function update(req, res) {
  try {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    if (slug) {
      const exists = await Category.findOne({ where: { slug } });
      if (exists && exists.id !== category.id) {
        return res.status(400).json({ message: "Slug já cadastrado." });
      }
    }

    await category.update({
      name,
      slug,
      use_in_menu,
    });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

/**
 * Remover categoria
 */
async function remove(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    await category.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

module.exports = {
  create,
  getById,
  search,
  update,
  remove,
};
