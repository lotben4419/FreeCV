const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('freecv', 'root', 'NouveauMotDePasse', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
