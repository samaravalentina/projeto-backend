// src/app.js
"use strict";

const express = require("express");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Rotas
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json({ limit: "10mb" })); // importante pro base64

// ✅ servir uploads
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

// ✅ Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Rotas API
app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

// ✅ rota padrão
app.get("/", (req, res) => res.json({ message: "API rodando ✅" }));

module.exports = app;
