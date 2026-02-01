"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/v1/product/search", productController.search);
router.get("/v1/product/:id", productController.show);

router.post("/v1/product", auth, productController.create);
router.put("/v1/product/:id", auth, productController.update);
router.delete("/v1/product/:id", auth, productController.remove);

router.delete("/v1/product/:id/image/:imageId", auth, productController.removeImage);

module.exports = router;
