const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = 'your_secret_key';

const authenticateFreelance = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ where: { id: decoded.id, role: 'freelance' } });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate as freelance.' });
  }
};

module.exports = authenticateFreelance;
