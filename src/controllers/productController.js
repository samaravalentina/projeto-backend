"use strict";

const {
  Product,
  Category,
  ProductImage,
  ProductOption,
  sequelize,
} = require("../models");

const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

function calcPriceWithDiscount(price, discountPercent) {
  const p = Number(price);
  const d = Number(discountPercent || 0);
  const final = p - (p * d) / 100;
  return Number(final.toFixed(2));
}

function buildPublicUrl(req, p) {
  if (!p) return p;
  if (/^https?:\/\//i.test(p)) return p;
  return `${req.protocol}://${req.get("host")}/${String(p).replace(/^\/+/, "")}`;
}

function normalizeProduct(req, productInstance) {
  const p = productInstance.toJSON();

  return {
    id: p.id,
    enabled: Boolean(p.enabled),
    name: p.name,
    slug: p.slug,
    stock: p.stock,
    description: p.description,
    price: p.price,
    price_with_discount: p.price_with_discount,
    category_ids: (p.categories || []).map((c) => c.id),
    images: (p.images || []).map((img) => ({
      id: img.id,
      content: buildPublicUrl(req, img.path),
    })),
    options: (p.options || []).map((op) => ({
      id: op.id,
      title: op.title,
      shape: op.shape,
      radius: op.radius,
      type: op.type,
      values: op.values, // se no seu model estiver string, ok
    })),
  };
}

async function saveBase64Image(productId, type, content) {
  const map = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
  };

  const ext = map[type];
  if (!ext) throw new Error("Tipo de imagem não suportado. Use png/jpg/jpeg/webp.");

  const dir = path.resolve(__dirname, "..", "..", "uploads", "products", String(productId));
  await fs.mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const absPath = path.join(dir, filename);

  const raw = String(content || "").includes("base64,")
    ? String(content).split("base64,")[1]
    : String(content);

  const buffer = Buffer.from(raw, "base64");
  await fs.writeFile(absPath, buffer);

  return `/uploads/products/${productId}/${filename}`;
}

async function unlinkIfExists(relPath) {
  if (!relPath) return;

  // relPath exemplo: /uploads/products/9/abc.png
  // se for URL externa, não tenta apagar
  if (/^https?:\/\//i.test(relPath)) return;

  const projectRoot = path.resolve(__dirname, "..", "..");
  const absPath = path.resolve(projectRoot, relPath.replace(/^\/+/, ""));

  try {
    await fs.unlink(absPath);
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
}

module.exports = {
  // GET /v1/product/search?limit=12&page=1&match=tenis&fields=name,price,images
  async search(req, res) {
    try {
      let { limit = "12", page = "1", match, fields } = req.query;

      limit = Number(limit);
      page = Number(page);

      if (Number.isNaN(limit) || limit === 0) limit = 12;
      if (Number.isNaN(page) || page < 1) page = 1;

      const where = {};

      if (match && String(match).trim()) {
        const term = `%${String(match).trim()}%`;
        // sem Op aqui -> usa sintaxe do sequelize diretamente:
        where["$or"] = undefined; // só pra evitar eslint em projetos
        where[sequelize.Op?.or || "or"] = undefined; // fallback
        // Como você não usa Op no resto, vamos usar Sequelize.Op de forma segura:
      }

      // ✅ forma segura (sem depender de import Op)
      const Sequelize = require("sequelize");
      if (match && String(match).trim()) {
        const term = `%${String(match).trim()}%`;
        where[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.like]: term } },
          { description: { [Sequelize.Op.like]: term } },
        ];
      }

      const include = [
        { association: "categories", attributes: ["id"], through: { attributes: [] } },
        { association: "images", attributes: ["id", "path"] },
        { association: "options" },
      ];

      const findOptions = {
        where,
        include,
        distinct: true,
        order: [["id", "DESC"]],
      };

      if (limit !== -1) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      }

      const { count: total, rows } = await Product.findAndCountAll(findOptions);

      const wanted = fields
        ? String(fields).split(",").map((s) => s.trim()).filter(Boolean)
        : null;

      const data = rows.map((prod) => {
        const normalized = normalizeProduct(req, prod);

        if (!wanted || wanted.length === 0) return normalized;

        const filtered = { id: normalized.id };
        for (const key of wanted) {
          if (key in normalized) filtered[key] = normalized[key];
        }
        return filtered;
      });

      return res.json({ data, total, limit, page });
    } catch (err) {
      console.log("SEARCH PRODUCT ERROR:", err);
      return res.status(500).json({ message: "Erro ao buscar produtos.", error: err.message });
    }
  },

  // GET /v1/product/:id
  async show(req, res) {
    try {
      const { id } = req.params;

      const item = await Product.findByPk(id, {
        include: [
          { association: "categories", attributes: ["id"], through: { attributes: [] } },
          { association: "images", attributes: ["id", "path"] },
          { association: "options" },
        ],
      });

      if (!item) return res.status(404).json({ message: "Produto não encontrado." });

      return res.status(200).json(normalizeProduct(req, item));
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar produto.", error: err.message });
    }
  },

  // POST /v1/product
  async create(req, res) {
    const writtenFiles = [];
    const t = await sequelize.transaction();

    try {
      const body = req.body || {};

      const enabled = body.enabled ?? true;
      const name = body.name;
      const slug = body.slug;
      const stock = body.stock ?? 0;
      const description = body.description ?? null;

      const price = body.price;

      const price_with_discount =
        body.price_with_discount !== undefined && body.price_with_discount !== null
          ? Number(body.price_with_discount)
          : calcPriceWithDiscount(price, body.discountPercent || 0);

      const categoryIds = body.category_ids ?? body.categoryIds ?? [];
      const images = body.images ?? [];
      const options = body.options ?? [];

      if (!name || !slug) {
        await t.rollback();
        return res.status(400).json({ message: "name e slug são obrigatórios." });
      }
      if (price === undefined || price === null || Number.isNaN(Number(price))) {
        await t.rollback();
        return res.status(400).json({ message: "price é obrigatório e precisa ser número." });
      }
      if (Number.isNaN(Number(price_with_discount))) {
        await t.rollback();
        return res.status(400).json({ message: "price_with_discount precisa ser número." });
      }

      const product = await Product.create(
        {
          enabled: Boolean(enabled),
          name,
          slug,
          stock: Number(stock) || 0,
          description,
          price: Number(price),
          price_with_discount,
        },
        { transaction: t }
      );

      // categorias
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        const categories = await Category.findAll({
          where: { id: categoryIds },
          transaction: t,
        });

        if (categories.length !== categoryIds.length) {
          await t.rollback();
          return res.status(400).json({
            message: "Uma ou mais category_ids não existem.",
            sent: categoryIds,
            found: categories.map((c) => c.id),
          });
        }

        await product.setCategories(categoryIds, { transaction: t });
      }

      // imagens base64
      if (Array.isArray(images) && images.length > 0) {
        for (const img of images) {
          if (!img?.type || !img?.content) {
            await t.rollback();
            return res.status(400).json({
              message: "images precisa conter itens com { type, content }.",
            });
          }

          const relPath = await saveBase64Image(product.id, img.type, img.content);
          writtenFiles.push(relPath);

          await ProductImage.create(
            { product_id: product.id, enabled: true, path: relPath },
            { transaction: t }
          );
        }
      }

      // opções (create simples)
      if (Array.isArray(options) && options.length > 0) {
        for (const o of options) {
          if (!o?.title) continue;
          await ProductOption.create(
            {
              product_id: product.id,
              title: o.title,
              shape: o.shape ?? "square",
              radius: o.radius ?? 0,
              type: o.type ?? "text",
              values: Array.isArray(o.values) ? o.values.join(",") : o.values,
            },
            { transaction: t }
          );
        }
      }

      await t.commit();

      const created = await Product.findByPk(product.id, {
        include: [
          { association: "categories", attributes: ["id"], through: { attributes: [] } },
          { association: "images", attributes: ["id", "path"] },
          { association: "options" },
        ],
      });

      return res.status(201).json(normalizeProduct(req, created));
    } catch (err) {
      await t.rollback();
      for (const relPath of writtenFiles) {
        try { await unlinkIfExists(relPath); } catch (_) {}
      }
      console.log("CREATE PRODUCT ERROR:", err);
      return res.status(500).json({ message: "Erro ao criar produto.", error: err.message });
    }
  },

  // PUT /v1/product/:id -> 204 No Content (escopo)
  async update(req, res) {
    const writtenFiles = [];
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const body = req.body || {};

      const product = await Product.findByPk(id, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      // básicos
      if (body.enabled !== undefined) product.enabled = Boolean(body.enabled);
      if (body.name !== undefined) product.name = body.name;
      if (body.slug !== undefined) product.slug = body.slug;
      if (body.stock !== undefined) product.stock = Number(body.stock) || 0;
      if (body.description !== undefined) product.description = body.description;

      if (body.price !== undefined) {
        if (body.price === null || Number.isNaN(Number(body.price))) {
          await t.rollback();
          return res.status(400).json({ message: "price precisa ser número." });
        }
        product.price = Number(body.price);
      }

      if (body.price_with_discount !== undefined) {
        if (body.price_with_discount === null || Number.isNaN(Number(body.price_with_discount))) {
          await t.rollback();
          return res.status(400).json({ message: "price_with_discount precisa ser número." });
        }
        product.price_with_discount = Number(body.price_with_discount);
      } else if (body.discountPercent !== undefined && product.price !== undefined) {
        product.price_with_discount = calcPriceWithDiscount(product.price, body.discountPercent);
      }

      await product.save({ transaction: t });

      // categorias
      const categoryIds = body.category_ids ?? body.categoryIds;
      if (Array.isArray(categoryIds)) {
        const categories = await Category.findAll({
          where: { id: categoryIds },
          transaction: t,
        });

        if (categories.length !== categoryIds.length) {
          await t.rollback();
          return res.status(400).json({
            message: "Uma ou mais category_ids não existem.",
            sent: categoryIds,
            found: categories.map((c) => c.id),
          });
        }

        await product.setCategories(categoryIds, { transaction: t });
      }

      // ===== IMAGES (formato do escopo) =====
      const imagesPayload = Array.isArray(body.images) ? body.images : [];

      // deletar
      const toDeleteIds = imagesPayload
        .filter((img) => img && img.id && img.deleted === true)
        .map((img) => Number(img.id))
        .filter((n) => !Number.isNaN(n));

      if (toDeleteIds.length > 0) {
        const imgs = await ProductImage.findAll({
          where: { id: toDeleteIds, product_id: product.id },
          transaction: t,
        });

        for (const img of imgs) {
          await unlinkIfExists(img.path);
          await img.destroy({ transaction: t });
        }
      }

      // atualizar existentes
      const toUpdate = imagesPayload.filter(
        (img) => img && img.id && img.content && img.deleted !== true
      );

      for (const img of toUpdate) {
        const imageId = Number(img.id);
        if (Number.isNaN(imageId)) continue;

        const dbImg = await ProductImage.findOne({
          where: { id: imageId, product_id: product.id },
          transaction: t,
        });
        if (!dbImg) continue;

        const content = String(img.content);

        // URL externa
        if (/^https?:\/\//i.test(content)) {
          dbImg.path = content;
          await dbImg.save({ transaction: t });
          continue;
        }

        // base64 precisa type
        if (!img.type) {
          await t.rollback();
          return res.status(400).json({
            message: "Para atualizar imagem com base64, envie também o campo type.",
          });
        }

        await unlinkIfExists(dbImg.path);

        const newRelPath = await saveBase64Image(product.id, img.type, content);
        writtenFiles.push(newRelPath);

        dbImg.path = newRelPath;
        await dbImg.save({ transaction: t });
      }

      // adicionar novas
      const toAdd = imagesPayload.filter((img) => img && !img.id && img.type && img.content);

      for (const img of toAdd) {
        const relPath = await saveBase64Image(product.id, img.type, img.content);
        writtenFiles.push(relPath);

        await ProductImage.create(
          { product_id: product.id, enabled: true, path: relPath },
          { transaction: t }
        );
      }

      // ===== OPTIONS (formato do escopo) =====
      const optionsPayload = Array.isArray(body.options) ? body.options : [];

      // delete
      const optDeleteIds = optionsPayload
        .filter((o) => o && o.id && o.deleted === true)
        .map((o) => Number(o.id))
        .filter((n) => !Number.isNaN(n));

      if (optDeleteIds.length > 0) {
        await ProductOption.destroy({
          where: { id: optDeleteIds, product_id: product.id },
          transaction: t,
        });
      }

      // update
      const optUpdate = optionsPayload.filter((o) => o && o.id && o.deleted !== true);
      for (const o of optUpdate) {
        const optionId = Number(o.id);
        if (Number.isNaN(optionId)) continue;

        const dbOpt = await ProductOption.findOne({
          where: { id: optionId, product_id: product.id },
          transaction: t,
        });
        if (!dbOpt) continue;

        if (o.title !== undefined) dbOpt.title = o.title;
        if (o.shape !== undefined) dbOpt.shape = o.shape;
        if (o.radius !== undefined) dbOpt.radius = o.radius;
        if (o.type !== undefined) dbOpt.type = o.type;

        if (o.values !== undefined) {
          dbOpt.values = Array.isArray(o.values) ? o.values.join(",") : o.values;
        }

        await dbOpt.save({ transaction: t });
      }

      // create
      const optCreate = optionsPayload.filter((o) => o && !o.id && o.title);
      for (const o of optCreate) {
        await ProductOption.create(
          {
            product_id: product.id,
            title: o.title,
            shape: o.shape ?? "square",
            radius: o.radius ?? 0,
            type: o.type ?? "text",
            values: Array.isArray(o.values) ? o.values.join(",") : o.values,
          },
          { transaction: t }
        );
      }

      await t.commit();
      return res.status(204).send();
    } catch (err) {
      await t.rollback();
      for (const relPath of writtenFiles) {
        try { await unlinkIfExists(relPath); } catch (_) {}
      }
      console.log("UPDATE PRODUCT ERROR:", err);
      return res.status(500).json({ message: "Erro ao atualizar produto.", error: err.message });
    }
  },

  // DELETE /v1/product/:id -> 204
  async remove(req, res) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      const imgs = await ProductImage.findAll({
        where: { product_id: product.id },
        transaction: t,
      });

      for (const img of imgs) {
        await unlinkIfExists(img.path);
        await img.destroy({ transaction: t });
      }

      await ProductOption.destroy({ where: { product_id: product.id }, transaction: t });

      await product.destroy({ transaction: t });

      await t.commit();
      return res.status(204).send();
    } catch (err) {
      await t.rollback();
      return res.status(500).json({ message: "Erro ao deletar produto.", error: err.message });
    }
  },

  // DELETE /v1/product/:id/image/:imageId -> 204
  async removeImage(req, res) {
    const t = await sequelize.transaction();

    try {
      const { id, imageId } = req.params;

      const img = await ProductImage.findOne({
        where: { id: Number(imageId), product_id: Number(id) },
        transaction: t,
      });

      if (!img) {
        await t.rollback();
        return res.status(404).json({ message: "Imagem não encontrada para esse produto." });
      }

      await unlinkIfExists(img.path);
      await img.destroy({ transaction: t });

      await t.commit();
      return res.status(204).send();
    } catch (err) {
      await t.rollback();
      return res.status(500).json({ message: "Erro ao remover imagem.", error: err.message });
    }
  },
};
