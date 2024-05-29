const express = require('express');
const stripe = require('../config/stripe');
const { Pack, Company } = require('../models');
const authenticateCompany = require('../middleware/authenticateCompany');

const router = express.Router();

// Route pour créer un paiement et ajouter des crédits
router.post('/create-payment-intent', authenticateCompany, async (req, res) => {
  const { packId } = req.body;

  try {
    const pack = await Pack.findByPk(packId);
    if (!pack) {
      return res.status(400).json({ error: 'Pack non trouvé' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: pack.price,
      currency: 'usd',
    });

    // Ajout des crédits après paiement réussi (à compléter selon votre logique de confirmation de paiement)
    const company = req.company;
    company.credits += pack.credits;
    await company.save();

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
