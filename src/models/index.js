const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Company = require('./Company');
const CV = require('./CV');
const JobPost = require('./JobPost');
const Admin = require('./Admin');
const Coordinates = require('./Coordinates');
const Pack = require('./Pack');

const models = {
  User,
  Company,
  CV,
  JobPost,
  Admin,
  Coordinates,
  Pack,
};

// Associations
CV.hasOne(Coordinates, {
  foreignKey: 'cvId',
  as: 'coordinates',
});

Coordinates.belongsTo(CV, {
  foreignKey: 'cvId',
  as: 'cv',
});

Company.hasMany(JobPost, {
  foreignKey: 'companyId',
  as: 'jobPosts',
});

JobPost.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
});

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
