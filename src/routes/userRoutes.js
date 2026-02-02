"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Autenticação
 *   - name: Usuário
 *     description: Operações de usuário
 */

/**
 * @openapi
 * /v1/user/token:
 *   post:
 *     tags: [Auth]
 *     summary: Gerar token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "samara@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Token gerado
 *       400:
 *         description: Dados inválidos
 */
router.post("/v1/user/token", userController.token);

/**
 * @openapi
 * /v1/user/{id}:
 *   get:
 *     tags: [Usuário]
 *     summary: Obter usuário por ID
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
router.get("/v1/user/:id", userController.getById);

/**
 * @openapi
 * /v1/user:
 *   post:
 *     tags: [Usuário]
 *     summary: Criar usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Samara" }
 *               email: { type: string, example: "samara@email.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       201:
 *         description: Criado
 *       400:
 *         description: Dados inválidos
 */
router.post("/v1/user", userController.create);

/**
 * @openapi
 * /v1/user/{id}:
 *   put:
 *     tags: [Usuário]
 *     summary: Atualizar usuário
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
 *               name: { type: string, example: "Samara Atualizada" }
 *               email: { type: string, example: "samara@email.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       204:
 *         description: Atualizado (sem conteúdo)
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Não encontrado
 */
router.put("/v1/user/:id", auth, userController.update);

/**
 * @openapi
 * /v1/user/{id}:
 *   delete:
 *     tags: [Usuário]
 *     summary: Deletar usuário
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
router.delete("/v1/user/:id", auth, userController.remove);

module.exports = router;
