const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const SECRET_KEY = 'your_secret_key';

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET_KEY);
    const admin = await Admin.findOne({ where: { id: decoded.id } });

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate as admin.' });
  }
};

module.exports = authenticateAdmin;
