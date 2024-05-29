const express = require('express');
const { ContactInfo } = require('../models');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = express.Router();

// Route pour créer les coordonnées d'un utilisateur
router.post('/', authenticateAdmin, async (req, res) => {
  const { userId, phone, address } = req.body;

  try {
    const contactInfo = await ContactInfo.create({ userId, phone, address });
    res.status(201).json(contactInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
