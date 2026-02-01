require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { Umzug, SequelizeStorage } = require("umzug");
const sequelize = require("./database");

const migrationsFolder = path.resolve(__dirname, "..", "models", "migrations");

const umzug = new Umzug({
  migrations: {
    glob: path.join(migrationsFolder, "*.js").replace(/\\/g, "/"),
    resolve: ({ name, path: filepath, context }) => {
      const migration = require(filepath);
      return {
        name,
        up: () => migration.up(context, sequelize.constructor),
        down: () => migration.down(context, sequelize.constructor),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectado.");
    console.log("📁 Pasta migrations:", migrationsFolder);

    const pending = await umzug.pending();
    console.log("⏳ Pendentes:", pending.map((m) => m.name));

    const migrations = await umzug.up();
    console.log("✅ Migrations rodadas:", migrations.map((m) => m.name));

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao rodar migrations:", err);
    process.exit(1);
  }
})();
