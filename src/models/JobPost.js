const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class JobPost extends Model {}

JobPost.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'JobPost',
});

module.exports = JobPost;
