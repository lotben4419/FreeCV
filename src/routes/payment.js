// src/routes/payment.js
const express = require('express');
const stripe = require('../config/stripe');
const router = express.Router();

// Route pour récupérer la clé publique
router.get('/public-key', (req, res) => {
  res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
});

// Route pour créer un paiement
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
