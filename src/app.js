"use strict";

const express = require("express");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json({ limit: "10mb" }));

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.get("/", (req, res) => res.json({ message: "API rodando ✅" }));

module.exports = app;
