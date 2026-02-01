const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

function mimeToExt(mime) {
  const map = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
  };
  return map[mime] || null;
}

function stripBase64Prefix(content) {
  // aceita "data:image/png;base64,AAAA" OU só "AAAA"
  const idx = content.indexOf("base64,");
  if (idx !== -1) return content.slice(idx + "base64,".length);
  return content;
}

/**
 * Salva uma imagem base64 em /uploads/products/:productId/
 * Retorna o path RELATIVO para salvar no banco (ex: /uploads/products/10/abc.png)
 */
async function saveProductBase64Image({ productId, type, content }) {
  const ext = mimeToExt(type);
  if (!ext) {
    const err = new Error(`Tipo de imagem não suportado: ${type}`);
    err.statusCode = 400;
    throw err;
  }

  const baseDir = path.resolve(__dirname, "..", "..", "uploads", "products", String(productId));
  await fs.mkdir(baseDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const fileAbsPath = path.join(baseDir, filename);

  const raw = stripBase64Prefix(content);
  let buffer;
  try {
    buffer = Buffer.from(raw, "base64");
  } catch {
    const err = new Error("Base64 inválido.");
    err.statusCode = 400;
    throw err;
  }

  // (opcional) validação simples: evita salvar arquivo vazio
  if (!buffer || buffer.length < 20) {
    const err = new Error("Imagem vazia ou base64 inválido.");
    err.statusCode = 400;
    throw err;
  }

  await fs.writeFile(fileAbsPath, buffer);

  // path relativo (mais portátil) — começa com "/uploads/..."
  const relativePath = path
    .join("/uploads", "products", String(productId), filename)
    .replaceAll("\\", "/");

  return relativePath;
}

async function deleteFileIfExists(absPath) {
  try {
    await fs.unlink(absPath);
  } catch (_) {
    // ignora
  }
}

module.exports = {
  saveProductBase64Image,
  deleteFileIfExists,
};
