const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Pack extends Model {}

Pack.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Pack',
});

module.exports = Pack;
