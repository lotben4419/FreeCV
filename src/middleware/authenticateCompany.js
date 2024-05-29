const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const SECRET_KEY = 'your_secret_key';

const authenticateCompany = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET_KEY);
    const company = await Company.findOne({ where: { id: decoded.id } });

    if (!company) {
      throw new Error();
    }

    req.company = company;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate as company.' });
  }
};

module.exports = authenticateCompany;
