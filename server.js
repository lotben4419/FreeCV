require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./src/config/database');

// Import des routes d'authentification, des free-lances, des entreprises, des administrateurs, des annonces et des paiements
const authRoutes = require('./src/routes/auth');
const freelanceRoutes = require('./src/routes/freelance');
const companyRoutes = require('./src/routes/company');
const adminRoutes = require('./src/routes/admin');
const jobPostRoutes = require('./src/routes/jobPost');
const paymentRoutes = require('./src/routes/payment');

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

// Utilisation des routes d'authentification
app.use('/api/auth', authRoutes);

// Utilisation des routes des free-lances
app.use('/api/freelance', freelanceRoutes);

// Utilisation des routes des entreprises
app.use('/api/company', companyRoutes);

// Utilisation des routes des administrateurs
app.use('/api/admin', adminRoutes);

// Utilisation des routes des annonces
app.use('/api/jobPost', jobPostRoutes);

// Utilisation des routes des paiements
app.use('/api/payment', paymentRoutes);

// Sync database and start server
sequelize.sync() // Retirez l'option { force: true }
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
