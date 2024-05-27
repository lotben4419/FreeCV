const sequelize = require('./src/config/database');

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    process.exit();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
