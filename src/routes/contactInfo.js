const express = require('express');
const { ContactInfo, User } = require('../models');
const authenticateCompany = require('../middleware/authenticateCompany');

const router = express.Router();

// Route pour acheter un pack
router.post('/buy-pack', authenticateCompany, async (req, res) => {
  const { packId } = req.body;
  const companyId = req.user.id;  // Assurez-vous que l'utilisateur authentifié est une entreprise

  // Logique pour gérer l'achat du pack et l'attribution des crédits
  // ...

  res.json({ message: 'Pack acheté avec succès' });
});

// Route pour accéder aux coordonnées
router.get('/:cvId', authenticateCompany, async (req, res) => {
  const { cvId } = req.params;
  const companyId = req.user.id;  // Assurez-vous que l'utilisateur authentifié est une entreprise

  // Vérifiez si l'entreprise a suffisamment de crédits
  // Si oui, décrémentez les crédits et renvoyez les coordonnées associées au CV
  // ...

  res.json(contactInfo);
});

module.exports = router;
