const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    description: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    price_with_discount: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    tableName: "products",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Product;
