"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const productController = require("../controllers/productController");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Produto
 *     description: Operações de produto
 */

/**
 * @openapi
 * /v1/product/search:
 *   get:
 *     tags: [Produto]
 *     summary: Buscar produtos
 *     responses:
 *       200:
 *         description: Ok
 */
router.get("/v1/product/search", productController.search);

/**
 * @openapi
 * /v1/product/{id}:
 *   get:
 *     tags: [Produto]
 *     summary: Obter produto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Não encontrado
 */
router.get("/v1/product/:id", productController.show);

/**
 * @openapi
 * /v1/product:
 *   post:
 *     tags: [Produto]
 *     summary: Criar produto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string, example: "Shampoo" }
 *               price: { type: number, example: 29.9 }
 *               description: { type: string, example: "Shampoo 300ml" }
 *     responses:
 *       201:
 *         description: Criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post("/v1/product", auth, productController.create);

/**
 * @openapi
 * /v1/product/{id}:
 *   put:
 *     tags: [Produto]
 *     summary: Atualizar produto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Shampoo Premium" }
 *               price: { type: number, example: 39.9 }
 *               description: { type: string, example: "Shampoo 300ml" }
 *     responses:
 *       204:
 *         description: Atualizado (sem conteúdo)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Não encontrado
 */
router.put("/v1/product/:id", auth, productController.update);

/**
 * @openapi
 * /v1/product/{id}:
 *   delete:
 *     tags: [Produto]
 *     summary: Deletar produto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Removido (sem conteúdo)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Não encontrado
 */
router.delete("/v1/product/:id", auth, productController.remove);

/**
 * @openapi
 * /v1/product/{id}/image/{imageId}:
 *   delete:
 *     tags: [Produto]
 *     summary: Remover imagem do produto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Removido (sem conteúdo)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Não encontrado
 */
router.delete(
  "/v1/product/:id/image/:imageId",
  auth,
  productController.removeImage
);

module.exports = router;
