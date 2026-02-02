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

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    path.join(__dirname, "..", "routes", "*.js"),
    path.join(__dirname, "..", "controllers", "*.js"),
  ],
};

module.exports = swaggerJSDoc(options);
