# Projeto Backend API

API REST desenvolvida em **Node.js + Express** para gerenciamento de **Usuários, Categorias e Produtos**, com autenticação JWT, upload de imagens e documentação interativa via Swagger.

Projeto desenvolvido individualmente como prática de Back-end no programa **Geração Tech 3.0**.

---

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- Sequelize
- MySQL / MariaDB
- JWT (JSON Web Token)
- Swagger
- Nodemon
- Dotenv

---

## 📌 Funcionalidades

### Usuário
- Criar usuário
- Buscar usuário por ID
- Atualizar usuário (com token)
- Deletar usuário (com token)
- Gerar token JWT

### Categoria
- Criar categoria (com token)
- Listar categorias
- Buscar categoria por ID
- Atualizar categoria (com token)
- Deletar categoria (com token)

### Produto
- Criar produto (com token)
- Listar produtos
- Buscar produto por ID
- Atualizar produto (com token)
- Deletar produto (com token)
- Upload de imagens
- Remoção de imagens

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)**.

Fluxo:
1. Criar usuário
2. Gerar token em `/v1/user/token`
3. Clicar em **Authorize** no Swagger
4. Inserir:


---

## 📚 Documentação da API

Swagger disponível em: http://localhost:3000/docs

---

## ⚙️ Como Rodar o Projeto

### 1. Clonar o repositório

git clone https://github.com/samaravalentina/projeto-backend.git

Instalar dependências
npm install

Criar arquivo .env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=123456
DB_NAME=backend_db
JWT_SECRET=segredo_super

Rodar migrations
node src/config/migrate.js

Iniciar servidor
npm run dev

## Estrutura do Projeto

```
src/
 ├─ config/
 │   ├─ database.js
 │   ├─ migrate.js
 │   └─ swagger.js
 │
 ├─ controllers/
 │   ├─ userController.js
 │   ├─ categoryController.js
 │   └─ productController.js
 │
 ├─ docs/
 │   └─ api.js
 │
 ├─ middleware/
 │   └─ auth.js
 │
 ├─ models/
 │   ├─ migrations/
 │   ├─ user.js
 │   ├─ category.js
 │   ├─ product.js
 │
 ├─ routes/
 │   ├─ userRoutes.js
 │   ├─ categoryRoutes.js
 │   └─ productRoutes.js
 │
 ├─ services/
 │
 ├─ app.js
 └─ server.js
```

## 📡 Endpoints Principais
```
Usuário
Método	Rota
POST	/v1/user
GET	/v1/user/:id
PUT	/v1/user/:id
DELETE	/v1/user/:id
POST	/v1/user/token

Categoria
Método	Rota
GET	/v1/category/search
GET	/v1/category/:id
POST	/v1/category
PUT	/v1/category/:id
DELETE	/v1/category/:id

Produto
Método	Rota
GET	/v1/product/search
GET	/v1/product/:id
POST	/v1/product
PUT	/v1/product/:id
DELETE	/v1/product/:id
```
🧠 Arquitetura

Padrão MVC + Services:

Routes → Endpoints

Controllers → Entrada e saída de dados

Services → Regras de negócio

Models → Banco de dados

Middleware → Autenticação JWT

Config → Banco, Swagger e Migrations

👩‍💻 Desenvolvido por

Samara Valentina da Silva

Projeto desenvolvido individualmente como prática de Back-end no Geração Tech 3.0.
