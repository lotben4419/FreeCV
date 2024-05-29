const express = require('express');
const multer = require('multer');
const path = require('path');
const { CV, Coordinates } = require('../models');

const router = express.Router();

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route pour télécharger la photo de profil, le CV, et les coordonnées
router.post('/cv', upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'cvFile', maxCount: 1 }]), async (req, res) => {
  try {
    const { userId, message, contactInfo } = req.body;
    const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0].filename : null;
    const cvFile = req.files['cvFile'] ? req.files['cvFile'][0].filename : null;

    const cv = await CV.create({ userId, profilePhoto, cvFile, message });
    await Coordinates.create({ cvId: cv.id, contactInfo });

    res.status(201).json(cv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir les informations des free-lances
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await CV.findOne({ where: { userId: id } });
    if (!cv) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }
    res.json(cv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour mettre à jour les informations des free-lances
router.put('/:id', upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'cvFile', maxCount: 1 }]), async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0].filename : null;
    const cvFile = req.files['cvFile'] ? req.files['cvFile'][0].filename : null;

    const cv = await CV.findOne({ where: { userId: id } });
    if (!cv) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    cv.message = message || cv.message;
    if (profilePhoto) {
      cv.profilePhoto = profilePhoto;
    }
    if (cvFile) {
      cv.cvFile = cvFile;
    }

    await cv.save();
    res.json(cv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour supprimer un CV
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await CV.findOne({ where: { userId: id } });
    if (!cv) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    await cv.destroy();
    res.json({ message: 'CV supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
