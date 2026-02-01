"use strict";

const sequelize = require("../config/database");

const User = require("./User");
const Category = require("./category");
const Product = require("./product");
const ProductImage = require("./ProductImage");
const ProductOption = require("./ProductOption");
const ProductCategory = require("./productCategories");

require("./associations");

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductOption,
  ProductCategory,
};