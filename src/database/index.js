const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const mode = process.env.NODE_ENV || 'development';
const config = require("../config/database.js")[mode];

const instance = new Sequelize(config.database, config.username, config.password, config);
const models = {};

fs.readdirSync(path.join(__dirname, "models")).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
}).forEach(file => {
  const model = require(path.join(__dirname, "models", file))(instance, Sequelize.DataTypes);
  models[model.name] = model;
});

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  instance, Sequelize, ...models
};
