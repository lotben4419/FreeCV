const express = require('express');
const { Pack } = require('../models');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = express.Router();

// Route pour créer un pack
router.post('/', authenticateAdmin, async (req, res) => {
  const { name, credits } = req.body;

  try {
    const pack = await Pack.create({ name, credits });
    res.status(201).json(pack);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir tous les packs
router.get('/', async (req, res) => {
  try {
    const packs = await Pack.findAll();
    res.json(packs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
