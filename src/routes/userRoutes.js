"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/v1/user/token", userController.token);

router.get("/v1/user/:id", userController.getById);
router.post("/v1/user", userController.create);
router.put("/v1/user/:id", auth, userController.update);
router.delete("/v1/user/:id", auth, userController.remove);

module.exports = router;
