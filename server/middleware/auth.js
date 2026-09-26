const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'shelterx-super-secret-key';

const generateToken = (user) => jwt.sign(
  {
    user_id: user.user_id,
    email: user.email,
    full_name: user.full_name,
    role: user.role || 'user',
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authorizeRole = (...allowedRoles) => (req, res, next) => {
  const role = req.user?.role || 'user';

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
  }

  next();
};

module.exports = {
  generateToken,
  authenticate,
  authorizeRole,
};
