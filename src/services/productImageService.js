const { ProductImage } = require("../models"); // ajuste conforme seu index de models

async function createProductImages({ productId, images, transaction }) {
  // images: [{ path, enabled }]
  if (!images?.length) return [];

  const payload = images.map((img) => ({
    product_id: productId,
    enabled: img.enabled ?? true,
    path: img.path,
  }));

  const created = await ProductImage.bulkCreate(payload, { transaction });
  return created;
}

module.exports = {
  createProductImages,
};
