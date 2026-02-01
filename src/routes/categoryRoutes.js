// src/routes/categoryRoutes.js
"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// Público
router.get("/v1/category/search", categoryController.search);
router.get("/v1/category/:id", categoryController.getById);

// Protegido
router.post("/v1/category", auth, categoryController.create);
router.put("/v1/category/:id", auth, categoryController.update);
router.delete("/v1/category/:id", auth, categoryController.remove);

module.exports = router;
