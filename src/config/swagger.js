// src/config/swagger.js
"use strict";

const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Projeto Backend API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: [
    path.join(__dirname, "..", "docs", "*.js"),      // ✅ docs centralizados
    path.join(__dirname, "..", "routes", "*.js"),    // (opcional)
    path.join(__dirname, "..", "controllers", "*.js")// (opcional)
  ],
};

module.exports = swaggerJSDoc(options);
