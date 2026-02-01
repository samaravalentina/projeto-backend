"use strict";

/**
 * Requisito 02 - Criar a tabela de categorias
 * columns:
 *  - id (PK, autoIncrement)
 *  - name (STRING, obrigatório)
 *  - slug (STRING, obrigatório)
 *  - use_in_menu (BOOLEAN, opcional, default 0)
 *  - created_at / updated_at (timestamps)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      use_in_menu: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false, // equivalente a 0
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Índices (recomendado)
    await queryInterface.addIndex("categories", ["slug"], {
      unique: true,
      name: "categories_slug_unique",
    });

    await queryInterface.addIndex("categories", ["use_in_menu"], {
      name: "categories_use_in_menu_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("categories");
  },
};
