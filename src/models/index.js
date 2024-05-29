const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Company = require('./Company');
const CV = require('./CV');
const JobPost = require('./JobPost');
const Admin = require('./Admin');
const ContactInfo = require('./ContactInfo');

const models = {
  User,
  Company,
  CV,
  JobPost,
  Admin,
  ContactInfo,
};

// Associations entre User et CV
User.hasMany(CV, {
  foreignKey: 'userId',
  as: 'cvs',
});

CV.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Associations entre User et ContactInfo
User.hasOne(ContactInfo, {
  foreignKey: 'userId',
  as: 'contactInfo',
});

ContactInfo.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Associations entre Company et JobPost
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
