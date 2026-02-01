/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Autenticação
 *   - name: User
 *     description: Operações de usuário
 *   - name: Category
 *     description: Operações de categoria
 *   - name: Product
 *     description: Operações de produto
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * /v1/user/token:
 *   post:
 *     summary: Gerar token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "user@mail.com" }
 *               password: { type: string, example: "123@123" }
 *     responses:
 *       200: { description: Token gerado }
 *       400: { description: Dados inválidos }
 */

/**
 * @openapi
 * /v1/user/{id}:
 *   get:
 *     summary: Obter usuário por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Não encontrado }
 *
 *   put:
 *     summary: Atualizar usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Atualizado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autorizado }
 *       404: { description: Não encontrado }
 *
 *   delete:
 *     summary: Deletar usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deletado }
 *       401: { description: Não autorizado }
 *       404: { description: Não encontrado }
 */

/**
 * @openapi
 * /v1/user:
 *   post:
 *     summary: Criar usuário
 *     tags: [User]
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Dados inválidos }
 */

/**
 * @openapi
 * /v1/category/search:
 *   get:
 *     summary: Buscar categorias
 *     tags: [Category]
 *     responses:
 *       200: { description: OK }
 *       400: { description: Dados inválidos }
 */

/**
 * @openapi
 * /v1/category/{id}:
 *   get:
 *     summary: Obter categoria por ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Não encontrado }
 *
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204: { description: Atualizado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autorizado }
 *       404: { description: Não encontrado }
 *
 *   delete:
 *     summary: Deletar categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204: { description: Deletado }
 *       401: { description: Não autorizado }
 *       404: { description: Não encontrado }
 */

/**
 * @openapi
 * /v1/category:
 *   post:
 *     summary: Criar categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autorizado }
 */

/**
 * @openapi
 * /v1/product/search:
 *   get:
 *     summary: Buscar produtos
 *     tags: [Product]
 *     responses:
 *       200: { description: OK }
 *       400: { description: Dados inválidos }
 */

/**
 * @openapi
 * /v1/product/{id}:
 *   get:
 *     summary: Obter produto por ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Não encontrado }
 *
 *   put:
 *     summary: Atualizar produto
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204: { description: Atualizado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autorizado }
 *       404: { description: Não encontrado }
 *
 *   delete:
 *     summary: Deletar produto
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204: { description: Deletado }
 *       401: { description: Não autorizado }
 *       404: { description: Não encontrado }
 */

/**
 * @openapi
 * /v1/product:
 *   post:
 *     summary: Criar produto
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autorizado }
 */

/**
 * @openapi
 * /v1/product/{id}/image/{imageId}:
 *   delete:
 *     summary: Remover imagem do produto
 *     tags: [Product]
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
 *       204: { description: Removida }
 *       401: { description: Não autorizado }
 *       404: { description: Não encontrada }
 */
