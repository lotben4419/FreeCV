const express = require('express');
const stripe = require('../config/stripe');
const { User, ContactInfo } = require('../models');
const authenticateCompany = require('../middleware/authenticateCompany');

const router = express.Router();

const PACK_PRICES = {
  'pack1': 1000, // prix en centimes pour 10 contacts
  'pack2': 2500, // prix en centimes pour 30 contacts
  'pack3': 4000, // prix en centimes pour 50 contacts
};

// Route pour créer un paiement
router.post('/create-payment-intent', authenticateCompany, async (req, res) => {
  const { packType } = req.body;

  if (!PACK_PRICES[packType]) {
    return res.status(400).json({ error: 'Invalid pack type' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: PACK_PRICES[packType],
      currency: 'usd',
    });
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour accéder aux coordonnées d'un utilisateur
router.get('/contact-info/:userId', authenticateCompany, async (req, res) => {
  const { userId } = req.params;

  try {
    const contactInfo = await ContactInfo.findOne({ where: { userId } });
    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact information not found' });
    }
    res.json(contactInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
