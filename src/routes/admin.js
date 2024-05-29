const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin, User, Company, CV, JobPost } = require('../models');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Assurez-vous que la clé est la même partout

// Route pour créer un administrateur
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashedPassword });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route de connexion de l'administrateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).json({ error: 'Administrateur non trouvé' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir tous les utilisateurs
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir toutes les entreprises
router.get('/companies', authenticateAdmin, async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir tous les CVs
router.get('/cvs', authenticateAdmin, async (req, res) => {
  try {
    const cvs = await CV.findAll();
    res.json(cvs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir toutes les annonces d'emploi
router.get('/jobPosts', authenticateAdmin, async (req, res) => {
  try {
    const jobPosts = await JobPost.findAll();
    res.json(jobPosts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour valider un CV
router.put('/cvs/:id/validate', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const cv = await CV.findByPk(id);
    if (!cv) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    // Ajoutez ici la logique de validation, par exemple, mettre à jour un champ `isValid` à `true`
    // cv.isValid = true;
    await cv.save();

    res.json(cv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour publier une annonce d'emploi
router.put('/jobPosts/:id/publish', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const jobPost = await JobPost.findByPk(id);
    if (!jobPost) {
      return res.status(404).json({ error: 'Annonce d\'emploi non trouvée' });
    }

    jobPost.isActive = true;
    await jobPost.save();

    res.json(jobPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour supprimer un utilisateur
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await user.destroy();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour supprimer une entreprise
router.delete('/companies/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findByPk(id, {
      include: [{ model: JobPost, as: 'jobPosts' }],
    });
    if (!company) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    // Supprimer toutes les annonces d'emploi associées
    await JobPost.destroy({ where: { companyId: company.id } });

    // Supprimer l'entreprise
    await company.destroy();
    res.json({ message: 'Entreprise et ses annonces supprimées avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour supprimer une annonce d'emploi
router.delete('/jobPosts/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const jobPost = await JobPost.findByPk(id);
    if (!jobPost) {
      return res.status(404).json({ error: 'Annonce d\'emploi non trouvée' });
    }

    await jobPost.destroy();
    res.json({ message: 'Annonce d\'emploi supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
