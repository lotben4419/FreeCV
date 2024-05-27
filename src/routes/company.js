const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

// Route d'inscription
router.post('/register', async (req, res) => {
  const { companyName, siret, city, postalCode, recruiterName, email, phone, billingAddress, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await Company.create({ companyName, siret, city, postalCode, recruiterName, email, phone, billingAddress, password: hashedPassword });
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ where: { email } });
    if (!company) {
      return res.status(400).json({ error: 'Entreprise non trouvée' });
    }

    const validPassword = await bcrypt.compare(password, company.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: company.id, role: 'company' }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
