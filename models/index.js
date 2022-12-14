const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const config = require('../config/database');

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const readModels = (dirName) => {
  fs
    .readdirSync(dirName)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const model = require(path.join(dirName, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
};

fs.readdirSync(__dirname, { withFileTypes: true })
  // eslint-disable-next-line array-callback-return
  .map((dirent) => {
    if (dirent.isFile()) readModels(__dirname);
    else if (dirent.isDirectory()) readModels(path.join(__dirname, dirent.name));
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
