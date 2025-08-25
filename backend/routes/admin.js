const express = require('express');
const { body, query, param } = require('express-validator');
const { adminAuth, eventOwnershipCheck } = require('../middleware/adminAuth');
const eventController = require('../controllers/eventController');
const adminLeadController = require('../controllers/adminLeadController');

const router = express.Router();

/**
 * Admin Routes
 * All routes are prefixed with /api/admin
 */

// EVENT MANAGEMENT ROUTES (Use Case A)

/**
 * POST /api/admin/events
 * Create a new event
 */
router.post('/events', [
  adminAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Event title must be between 3 and 200 characters'),
    
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Event description must be between 10 and 1000 characters'),
    
    body('startDate')
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    
    body('endDate')
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
    
    body('location')
      .trim()
      .isLength({ min: 5, max: 300 })
      .withMessage('Location must be between 5 and 300 characters'),
    
    body('college')
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('College name must be between 2 and 200 characters'),
    
    body('city')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('City must be between 2 and 100 characters'),
    
    body('state')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('State must be between 2 and 100 characters'),
    
    body('maxCapacity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Maximum capacity must be a non-negative integer'),
    
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Each tag must be between 1 and 50 characters'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),
    
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean value')
  ]
], eventController.createEvent);

/**
 * GET /api/admin/events
 * Get all events with pagination and filtering
 */
router.get('/events', [
  adminAuth,
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('status')
      .optional()
      .isIn(['draft', 'active', 'completed', 'cancelled'])
      .withMessage('Invalid status value'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
    
    query('sortBy')
      .optional()
      .isIn(['title', 'startDate', 'endDate', 'college', 'createdAt', 'updatedAt'])
      .withMessage('Invalid sort field'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ]
], eventController.getEvents);

/**
 * GET /api/admin/events/:eventId
 * Get single event by ID
 */
router.get('/events/:eventId', [
  adminAuth,
  [
    param('eventId')
      .matches(/^KAT-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid event ID format')
  ]
], eventController.getEventById);

/**
 * PUT /api/admin/events/:eventId
 * Update event
 */
router.put('/events/:eventId', [
  adminAuth,
  eventOwnershipCheck,
  [
    param('eventId')
      .matches(/^KAT-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid event ID format'),
    
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Event title must be between 3 and 200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Event description must be between 10 and 1000 characters'),
    
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
    
    body('location')
      .optional()
      .trim()
      .isLength({ min: 5, max: 300 })
      .withMessage('Location must be between 5 and 300 characters'),
    
    body('college')
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('College name must be between 2 and 200 characters'),
    
    body('city')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('City must be between 2 and 100 characters'),
    
    body('state')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('State must be between 2 and 100 characters'),
    
    body('maxCapacity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Maximum capacity must be a non-negative integer'),
    
    body('status')
      .optional()
      .isIn(['draft', 'active', 'completed', 'cancelled'])
      .withMessage('Invalid status value'),
    
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Each tag must be between 1 and 50 characters'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),
    
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean value')
  ]
], eventController.updateEvent);

/**
 * DELETE /api/admin/events/:eventId
 * Delete event
 */
router.delete('/events/:eventId', [
  adminAuth,
  eventOwnershipCheck,
  [
    param('eventId')
      .matches(/^KAT-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid event ID format')
  ]
], eventController.deleteEvent);

/**
 * GET /api/admin/events/:eventId/stats
 * Get event statistics
 */
router.get('/events/:eventId/stats', [
  adminAuth,
  [
    param('eventId')
      .matches(/^KAT-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid event ID format')
  ]
], eventController.getEventStats);

// ========================================
// LEAD MANAGEMENT ROUTES (Use Cases B, C, D)
// ========================================

/**
 * GET /api/admin/leads
 * Get all leads with pagination and filtering (Use Case B)
 */
router.get('/leads', [
  adminAuth,
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('eventId')
      .optional()
      .matches(/^KAT-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid event ID format'),
    
    query('status')
      .optional()
      .isIn(['registered', 'started', 'completed', 'dropped'])
      .withMessage('Invalid status value'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
    
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'lastActivity', 'status', 'studentInfo.name', 'studentInfo.email'])
      .withMessage('Invalid sort field'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ]
], adminLeadController.getAllLeads);

/**
 * GET /api/admin/events/:eventId/leads
 * Get leads by event ID (Use Case B - per event)
 */
router.get('/events/:eventId/leads', [
  adminAuth,
  [
    param('eventId')
      .matches(/^KAT-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid event ID format'),
    
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('status')
      .optional()
      .isIn(['registered', 'started', 'completed', 'dropped'])
      .withMessage('Invalid status value'),
    
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'lastActivity', 'status', 'studentInfo.name'])
      .withMessage('Invalid sort field'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ]
], adminLeadController.getLeadsByEvent);

/**
 * GET /api/admin/leads/:leadId
 * Get single lead by ID
 */
router.get('/leads/:leadId', [
  adminAuth,
  [
    param('leadId')
      .matches(/^LEAD-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid lead ID format')
  ]
], adminLeadController.getLeadById);

/**
 * PUT /api/admin/leads/:leadId/status
 * Update lead status (Use Case D - conversion funnel tracking)
 */
router.put('/leads/:leadId/status', [
  adminAuth,
  [
    param('leadId')
      .matches(/^LEAD-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid lead ID format'),
    
    body('status')
      .isIn(['registered', 'started', 'completed', 'dropped'])
      .withMessage('Invalid status value'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Notes cannot exceed 200 characters')
  ]
], adminLeadController.updateLeadStatus);

/**
 * POST /api/admin/leads/:leadId/notes
 * Add admin note to lead
 */
router.post('/leads/:leadId/notes', [
  adminAuth,
  [
    param('leadId')
      .matches(/^LEAD-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid lead ID format'),
    
    body('note')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Note must be between 1 and 500 characters')
  ]
], adminLeadController.addLeadNote);

/**
 * GET /api/admin/leads/export
 * Export leads to CSV (Use Case C)
 */
router.get('/leads/export', [
  adminAuth,
  [
    query('eventId')
      .optional()
      .matches(/^KAT-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid event ID format'),
    
    query('status')
      .optional()
      .isIn(['registered', 'started', 'completed', 'dropped'])
      .withMessage('Invalid status value'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date')
  ]
], adminLeadController.exportLeadsToCSV);

/**
 * GET /api/admin/leads/analytics
 * Get conversion funnel analytics (Use Case D)
 */
router.get('/leads/analytics', [
  adminAuth,
  [
    query('eventId')
      .optional()
      .matches(/^KAT-\d{4}-\d{2}-\d{2}-\d{3}$/)
      .withMessage('Invalid event ID format'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date')
  ]
], adminLeadController.getLeadAnalytics);

// ========================================
// DASHBOARD ROUTES
// ========================================

/**
 * GET /api/admin/dashboard
 * Get admin dashboard overview
 */
router.get('/dashboard', [
  adminAuth
], async (req, res) => {
  try {
    // Get quick statistics
    const eventCount = await require('../models/AdminEvent').countDocuments();
    const leadCount = await require('../models/AdminLead').countDocuments();
    const completedLeads = await require('../models/AdminLead').countDocuments({ status: 'completed' });
    
    // Get recent events
    const recentEvents = await require('../models/AdminEvent')
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('eventId title college city startDate status');
    
    // Get recent leads
    const recentLeads = await require('../models/AdminLead')
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('eventId', 'title college')
      .select('leadId eventId studentInfo.name status createdAt');
    
    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        overview: {
          totalEvents: eventCount,
          totalLeads: leadCount,
          completedLeads,
          completionRate: leadCount > 0 ? ((completedLeads / leadCount) * 100).toFixed(2) : 0
        },
        recentEvents,
        recentLeads
      }
    });
    
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
