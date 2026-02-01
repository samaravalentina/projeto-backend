"use strict";

const Product = require("./product");
const ProductImage = require("./ProductImage");
const ProductOption = require("./ProductOption");
const Category = require("./category");
const ProductCategory = require("./productCategories");

// Product 1:N Images
Product.hasMany(ProductImage, { foreignKey: "product_id", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product 1:N Options
Product.hasMany(ProductOption, { foreignKey: "product_id", as: "options" });
ProductOption.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product N:N Category
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "product_id",
  otherKey: "category_id",
  as: "categories",
});

Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "category_id",
  otherKey: "product_id",
  as: "products",
});
