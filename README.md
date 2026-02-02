Projeto Backend API

API REST desenvolvida em Node.js + Express como projeto prático do curso Geração Tech 3.0.
O objetivo foi construir uma API completa com autenticação, CRUD, documentação e boas práticas de organização de código.

Tecnologias Utilizadas

Node.js

Express

Sequelize

MySQL / SQLite (dependendo do ambiente)

JWT (JSON Web Token)

Swagger (Documentação da API)

Dotenv

Nodemon

Funcionalidades
Usuários

Criar usuário

Buscar usuário por ID

Atualizar usuário

Deletar usuário

Gerar token JWT

Categorias

Criar categoria

Buscar categoria por ID

Listar categorias

Atualizar categoria

Deletar categoria

Produtos

Criar produto

Buscar produto por ID

Listar produtos

Atualizar produto

Deletar produto

Upload e remoção de imagens

Estrutura do Projeto
src/
 ├─ config/
 │   ├─ database.js
 │   ├─ migrate.js
 │   └─ swagger.js
 │
 ├─ controllers/
 │
 ├─ docs/
 │
 ├─ middleware/
 │
 ├─ models/
 │   ├─ migrations/
 │   ├─ associations.js
 │   └─ ...
 │
 ├─ routes/
 │
 ├─ services/
 │
 ├─ app.js
 └─ server.js

Padrão Arquitetural

O projeto segue o padrão MVC + Services, separando:

Routes → Endpoints

Controllers → Entrada e saída de dados

Services → Regras de negócio

Models → Estrutura do banco

Middleware → Autenticação JWT

Config → Banco, Swagger e Migrations

Documentação da API

A documentação interativa está disponível via Swagger:

http://localhost:3000/docs


É possível testar todos os endpoints diretamente pelo navegador.

Autenticação

A API utiliza JWT (Bearer Token).

Fluxo:

Criar usuário

Gerar token em /v1/user/token

Clicar em Authorize no Swagger

Inserir o token:

Bearer SEU_TOKEN_AQUI

Status Codes Utilizados

200 → Sucesso

201 → Criado com sucesso

204 → Sem conteúdo (update/delete)

400 → Dados inválidos

401 → Não autorizado

404 → Não encontrado

Como Rodar o Projeto
1. Clonar o repositório
git clone URL_DO_REPOSITORIO

2. Instalar dependências
npm install

3. Criar arquivo .env

Exemplo:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=senha
DB_NAME=backend
JWT_SECRET=segredo

4. Rodar migrations
node src/config/migrate.js

5. Iniciar servidor
npm run dev

Testes

Os testes podem ser realizados diretamente pelo Swagger UI.

Diferenciais do Projeto

Arquitetura MVC organizada

Autenticação JWT

Documentação Swagger

Status Codes corretos

Upload de imagens

Migrations de banco

Projeto desenvolvido individualmente

Autor

Desenvolvido por Samara Valentina da Silva
Projeto acadêmico — Curso Geração Tech 3.0
