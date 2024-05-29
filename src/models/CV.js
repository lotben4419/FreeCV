const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CV = sequelize.define('CV', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cvFile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

const Coordinates = require('./Coordinates');
CV.hasOne(Coordinates, {
  foreignKey: 'cvId',
  as: 'coordinates',
});

module.exports = CV;
