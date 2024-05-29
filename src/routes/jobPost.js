const express = require('express');
const router = express.Router();
const JobPost = require('../models/JobPost');

// Route pour créer une annonce d'emploi
router.post('/', async (req, res) => {
  const { companyId, title, description, isActive, validUntil } = req.body;

  try {
    const jobPost = await JobPost.create({
      companyId,
      title,
      description,
      isActive,
      validUntil
    });
    res.status(201).json(jobPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir toutes les annonces
router.get('/', async (req, res) => {
  try {
    const jobPosts = await JobPost.findAll();
    res.json(jobPosts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir une annonce par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findOne({ where: { id } });
    if (!jobPost) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json(jobPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour mettre à jour une annonce
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive, validUntil } = req.body;

    const jobPost = await JobPost.findOne({ where: { id } });
    if (!jobPost) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }

    jobPost.title = title || jobPost.title;
    jobPost.description = description || jobPost.description;
    jobPost.isActive = isActive !== undefined ? isActive : jobPost.isActive;
    jobPost.validUntil = validUntil || jobPost.validUntil;

    await jobPost.save();
    res.json(jobPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour supprimer une annonce
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const jobPost = await JobPost.findOne({ where: { id } });
    if (!jobPost) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }

    await jobPost.destroy();
    res.json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
