// src/models/Pack.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pack = sequelize.define('Pack', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Pack;
