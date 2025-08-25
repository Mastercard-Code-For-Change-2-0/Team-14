const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  validate, 
  profileUpdateValidation, 
  passwordUpdateValidation 
} = require('../middleware/validate');
const {
  getProfile,
  updateProfile,
  changePassword,
  getUserById,
  searchUsers,
  deactivateAccount,
  getAllUsers,
  updateUserRole
} = require('../controllers/userController');

// Public routes
router.get('/search', searchUsers);
router.get('/:id', getUserById);

// Protected routes (require authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, profileUpdateValidation, validate, updateProfile);
router.put('/change-password', protect, passwordUpdateValidation, validate, changePassword);
router.delete('/deactivate', protect, deactivateAccount);

// Admin routes (require admin role)
router.get('/admin/all', protect, authorize('admin'), getAllUsers);
router.put('/admin/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;

