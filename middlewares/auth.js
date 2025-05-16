const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  console.log('🔐 Auth middleware hit');
  console.log('👉 Incoming Request Headers:', req.headers);

  let token;

  // 1. Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Token found:', token);
  }

  if (!token) {
    console.warn('❌ No token provided');
    return res.status(401).json({
      success: false,
      error: 'No token provided. Not authorized.',
    });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);

    // 3. Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn('❌ User not found');
      return res.status(401).json({
        success: false,
        error: 'User not found. Not authorized.',
      });
    }

    // 4. Check for admin role
    if (user.role !== 'admin') {
      console.warn(`❌ User role is '${user.role}', not 'admin'`);
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admins only.',
      });
    }

    // 5. All good, attach user to request
    req.user = user;
    console.log('✅ Admin access granted');
    next();

  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.',
    });
  }
};


