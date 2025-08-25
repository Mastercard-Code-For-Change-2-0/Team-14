const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Admin Authentication Middleware
 * Ensures only users with admin role can access admin routes
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.id).select('+role +isActive');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. User not found.' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Account is deactivated.' 
      });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    // Add user info to request
    req.adminUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Token expired.' 
      });
    }

    console.error('Admin Auth Middleware Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during authentication.' 
    });
  }
};

/**
 * Optional Admin Auth Middleware
 * Checks admin status but doesn't block access
 * Useful for routes that show different content for admins vs non-admins
 */
const optionalAdminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.isAdmin = false;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+role +isActive');
    
    if (user && user.isActive && user.role === 'admin') {
      req.isAdmin = true;
      req.adminUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };
    } else {
      req.isAdmin = false;
    }

    next();
  } catch (error) {
    // If token is invalid, just treat as non-admin
    req.isAdmin = false;
    next();
  }
};

/**
 * Event Ownership Check Middleware
 * Ensures admin can only modify events they created
 * Used for PUT/DELETE operations on events
 */
const eventOwnershipCheck = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const AdminEvent = require('../models/AdminEvent');
    
    const event = await AdminEvent.findOne({ eventId });
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found.' 
      });
    }

    // Check if admin created this event
    if (!event.canModify(req.adminUser.id)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You can only modify events you created.' 
      });
    }

    req.event = event;
    next();
  } catch (error) {
    console.error('Event Ownership Check Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during ownership check.' 
    });
  }
};

module.exports = {
  adminAuth,
  optionalAdminAuth,
  eventOwnershipCheck
};
