require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./src/config/database');

// Import des routes
const authRoutes = require('./src/routes/auth');
const freelanceRoutes = require('./src/routes/freelance');
const companyRoutes = require('./src/routes/company');
const adminRoutes = require('./src/routes/admin');
const jobPostRoutes = require('./src/routes/jobPost');
const paymentRoutes = require('./src/routes/payment');
const packRoutes = require('./src/routes/pack');

// Import des modèles pour synchronisation
const models = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Servir les fichiers statiques

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/freelance', freelanceRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobPost', jobPostRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/pack', packRoutes);

// Sync database and start server
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
