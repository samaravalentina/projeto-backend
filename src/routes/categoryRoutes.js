"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Categoria
 *     description: Operações de categoria
 */

/**
 * @openapi
 * /v1/category/search:
 *   get:
 *     tags: [Categoria]
 *     summary: Buscar categorias
 *     responses:
 *       200:
 *         description: Ok
 */
router.get("/v1/category/search", categoryController.search);

/**
 * @openapi
 * /v1/category/{id}:
 *   get:
 *     tags: [Categoria]
 *     summary: Obter categoria por ID
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
router.get("/v1/category/:id", categoryController.getById);

/**
 * @openapi
 * /v1/category:
 *   post:
 *     tags: [Categoria]
 *     summary: Criar categoria
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Perfumaria" }
 *     responses:
 *       201:
 *         description: Criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post("/v1/category", auth, categoryController.create);

/**
 * @openapi
 * /v1/category/{id}:
 *   put:
 *     tags: [Categoria]
 *     summary: Atualizar categoria
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
 *               name: { type: string, example: "Perfumaria Premium" }
 *     responses:
 *       204:
 *         description: Atualizado (sem conteúdo)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Não encontrado
 */
router.put("/v1/category/:id", auth, categoryController.update);

/**
 * @openapi
 * /v1/category/{id}:
 *   delete:
 *     tags: [Categoria]
 *     summary: Deletar categoria
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
router.delete("/v1/category/:id", auth, categoryController.remove);

module.exports = router;
