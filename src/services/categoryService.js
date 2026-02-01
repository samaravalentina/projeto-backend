const { Op } = require("sequelize");
const Category = require("../models/category");

function parseLimit(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 12;
  return n;
}

function parsePage(value) {
  const n = Number(value);
  if (Number.isNaN(n) || n < 1) return 1;
  return n;
}

function parseUseInMenu(value) {
  if (value === undefined) return undefined;
  const v = String(value).toLowerCase();
  if (["true", "1", "yes"].includes(v)) return true;
  if (["false", "0", "no"].includes(v)) return false;
  return undefined;
}

function parseFields(fields) {
  const allowed = new Set(["id", "name", "slug", "use_in_menu"]);
  if (!fields) return undefined;

  const list = String(fields)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const sanitized = list.filter((f) => allowed.has(f));
  return sanitized.length ? sanitized : undefined;
}

async function search(query) {
  const limit = parseLimit(query.limit ?? 12);
  const page = parsePage(query.page ?? 1);
  const fields = parseFields(query.fields);
  const useInMenu = parseUseInMenu(query.use_in_menu);

  const where = {};
  if (useInMenu !== undefined) where.use_in_menu = useInMenu;

  const findOptions = {
    where,
    order: [["id", "ASC"]],
  };

  if (fields) findOptions.attributes = fields;

  if (limit !== -1) {
    findOptions.limit = limit;
    findOptions.offset = (page - 1) * limit;
  }

  const { rows, count } = await Category.findAndCountAll(findOptions);

  return {
    data: rows,
    total: count,
    limit,
    page,
  };
}

async function getById(id) {
  return Category.findByPk(id);
}

async function create(payload) {
  return Category.create(payload);
}

async function update(id, payload) {
  const category = await Category.findByPk(id);
  if (!category) return null;

  await category.update(payload);
  return category;
}

async function remove(id) {
  const category = await Category.findByPk(id);
  if (!category) return null;

  await category.destroy();
  return true;
}

module.exports = {
  search,
  getById,
  create,
  update,
  remove,
};
