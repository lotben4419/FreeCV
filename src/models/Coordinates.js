const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coordinates = sequelize.define('Coordinates', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cvId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'CVs',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  contactInfo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Coordinates;
