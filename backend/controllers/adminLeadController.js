const AdminLead = require('../models/AdminLead');
const AdminEvent = require('../models/Events');
const { validationResult } = require('express-validator');
const { Parser } = require('json2csv');

/**
 * Admin Lead Controller
 * Handles lead management, conversion tracking, and export functionality
 */
class AdminLeadController {
  
  /**
   * Get all leads with pagination and filtering (Use Case B)
   * GET /api/admin/leads
   */
  async getAllLeads(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        eventId,
        status,
        college,
        year,
        fieldOfStudy,
        startDate,
        endDate,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build filter object
      const filter = {};
      
      if (eventId) filter.eventId = eventId;
      if (status) filter.status = status;
      if (college) filter['studentInfo.college'] = { $regex: college, $options: 'i' };
      if (year) filter['studentInfo.year'] = year;
      if (fieldOfStudy) filter['studentInfo.fieldOfStudy'] = { $regex: fieldOfStudy, $options: 'i' };
      if (startDate) filter.createdAt = { $gte: new Date(startDate) };
      if (endDate) filter.createdAt = { $lte: new Date(endDate) };
      if (search) {
        filter.$or = [
          { 'studentInfo.name': { $regex: search, $options: 'i' } },
          { 'studentInfo.email': { $regex: search, $options: 'i' } },
          { 'studentInfo.phone': { $regex: search, $options: 'i' } },
          { 'studentInfo.college': { $regex: search, $options: 'i' } },
          { 'studentInfo.fieldOfStudy': { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Get leads with pagination
      const leads = await AdminLead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('eventId', 'title college city state')
        .select('-__v');

      // Get total count for pagination
      const totalLeads = await AdminLead.countDocuments(filter);
      const totalPages = Math.ceil(totalLeads / parseInt(limit));

      // Return paginated response
      res.status(200).json({
        success: true,
        message: 'Leads retrieved successfully',
        data: {
          leads: leads.map(lead => ({
            leadId: lead.leadId,
            eventId: lead.eventId,
            studentInfo: lead.studentInfo,
            status: lead.status,
            ageInDays: lead.ageInDays,
            timeInCurrentStatus: lead.timeInCurrentStatus,
            application: {
              hasStarted: lead.application.hasStarted,
              hasCompleted: lead.application.hasCompleted,
              startedAt: lead.application.startedAt,
              completedAt: lead.application.completedAt
            },
            communication: {
              emailConsent: lead.communication.emailConsent,
              smsConsent: lead.communication.smsConsent,
              preferredContact: lead.communication.preferredContact,
              consentGiven: lead.communication.consentGiven
            },
            tags: lead.tags,
            isActive: lead.isActive,
            createdAt: lead.createdAt,
            lastActivity: lead.lastActivity
          })),
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalLeads,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get All Leads Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve leads',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get leads by event ID (Use Case B - per event)
   * GET /api/admin/events/:eventId/leads
   */
  async getLeadsByEvent(req, res) {
    try {
      const { eventId } = req.params;
      const {
        page = 1,
        limit = 50,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Verify event exists
      const event = await AdminEvent.findOne({ eventId });
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Build filter
      const filter = { eventId };
      if (status) filter.status = status;

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Get leads for this event
      const leads = await AdminLead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');

      // Get total count
      const totalLeads = await AdminLead.countDocuments(filter);
      const totalPages = Math.ceil(totalLeads / parseInt(limit));

      // Get status breakdown
      const statusBreakdown = await AdminLead.aggregate([
        { $match: { eventId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const statusCounts = {};
      statusBreakdown.forEach(stat => {
        statusCounts[stat._id] = stat.count;
      });

      res.status(200).json({
        success: true,
        message: 'Event leads retrieved successfully',
        data: {
          event: {
            eventId: event.eventId,
            title: event.title,
            college: event.college,
            city: event.city,
            state: event.state,
            startDate: event.startDate,
            endDate: event.endDate
          },
          leads: leads.map(lead => ({
            leadId: lead.leadId,
            studentInfo: lead.studentInfo,
            status: lead.status,
            ageInDays: lead.ageInDays,
            timeInCurrentStatus: lead.timeInCurrentStatus,
            application: {
              hasStarted: lead.application.hasStarted,
              hasCompleted: lead.application.hasCompleted
            },
            communication: {
              emailConsent: lead.communication.emailConsent,
              smsConsent: lead.communication.smsConsent,
              consentGiven: lead.communication.consentGiven
            },
            createdAt: lead.createdAt,
            lastActivity: lead.lastActivity
          })),
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalLeads,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          },
          statusBreakdown: statusCounts
        }
      });

    } catch (error) {
      console.error('Get Leads By Event Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve event leads',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get single lead by ID
   * GET /api/admin/leads/:leadId
   */
  async getLeadById(req, res) {
    try {
      const { leadId } = req.params;

      const lead = await AdminLead.findOne({ leadId })
        .populate('eventId', 'title college city state startDate endDate')
        .select('-__v');

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Lead retrieved successfully',
        data: {
          leadId: lead.leadId,
          eventId: lead.eventId,
          studentInfo: lead.studentInfo,
          status: lead.status,
          statusHistory: lead.statusHistory,
          ageInDays: lead.ageInDays,
          timeInCurrentStatus: lead.timeInCurrentStatus,
          application: lead.application,
          communication: lead.communication,
          source: lead.source,
          adminNotes: lead.adminNotes,
          tags: lead.tags,
          isActive: lead.isActive,
          createdAt: lead.createdAt,
          lastActivity: lead.lastActivity
        }
      });

    } catch (error) {
      console.error('Get Lead By ID Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve lead',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update lead status (Use Case D - conversion funnel tracking)
   * PUT /api/admin/leads/:leadId/status
   */
  async updateLeadStatus(req, res) {
    try {
      const { leadId } = req.params;
      const { status, notes } = req.body;

      // Validate status
      const validStatuses = ['registered', 'started', 'completed', 'dropped'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: registered, started, completed, dropped'
        });
      }

      const lead = await AdminLead.findOne({ leadId });
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
      }

      // Update status
      await lead.updateStatus(status, req.adminUser.id, notes);

      // Get updated lead
      const updatedLead = await AdminLead.findOne({ leadId })
        .populate('eventId', 'title college city state')
        .select('-__v');

      res.status(200).json({
        success: true,
        message: 'Lead status updated successfully',
        data: {
          leadId: updatedLead.leadId,
          eventId: updatedLead.eventId,
          status: updatedLead.status,
          statusHistory: updatedLead.statusHistory,
          application: updatedLead.application,
          lastActivity: updatedLead.lastActivity
        }
      });

    } catch (error) {
      console.error('Update Lead Status Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update lead status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Add admin note to lead
   * POST /api/admin/leads/:leadId/notes
   */
  async addLeadNote(req, res) {
    try {
      const { leadId } = req.params;
      const { note } = req.body;

      if (!note || note.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Note content is required'
        });
      }

      const lead = await AdminLead.findOne({ leadId });
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
      }

      // Add note
      await lead.addAdminNote(note.trim(), req.adminUser.id);

      res.status(200).json({
        success: true,
        message: 'Note added successfully',
        data: {
          leadId: lead.leadId,
          adminNotes: lead.adminNotes
        }
      });

    } catch (error) {
      console.error('Add Lead Note Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add note',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Export leads to CSV (Use Case C)
   * GET /api/admin/leads/export
   */
  async exportLeadsToCSV(req, res) {
    try {
      const {
        eventId,
        status,
        startDate,
        endDate,
        format = 'csv'
      } = req.query;

      // Build filter
      const filter = {};
      if (eventId) filter.eventId = eventId;
      if (status) filter.status = status;
      if (startDate) filter.createdAt = { $gte: new Date(startDate) };
      if (endDate) filter.createdAt = { $lte: new Date(endDate) };

      // Get leads with event information
      const leads = await AdminLead.find(filter)
        .populate('eventId', 'title college city state startDate endDate')
        .select('-__v');

      if (leads.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No leads found for export'
        });
      }

      // Prepare CSV data
      const csvData = leads.map(lead => ({
        'Lead ID': lead.leadId,
        'Event ID': lead.eventId,
        'Event Title': lead.eventId?.title || 'N/A',
        'Event College': lead.eventId?.college || 'N/A',
        'Event City': lead.eventId?.city || 'N/A',
        'Event State': lead.eventId?.state || 'N/A',
        'Event Start Date': lead.eventId?.startDate ? new Date(lead.eventId.startDate).toLocaleDateString() : 'N/A',
        'Student Name': lead.studentInfo.name,
        'Student Email': lead.studentInfo.email,
        'Student Phone': lead.studentInfo.phone,
        'Student College': lead.studentInfo.college,
        'Year of Study': lead.studentInfo.year,
        'Field of Study': lead.studentInfo.fieldOfStudy,
        'Lead Status': lead.status,
        'Has Started Application': lead.application.hasStarted ? 'Yes' : 'No',
        'Has Completed Application': lead.application.hasCompleted ? 'Yes' : 'No',
        'Application Started Date': lead.application.startedAt ? new Date(lead.application.startedAt).toLocaleDateString() : 'N/A',
        'Application Completed Date': lead.application.completedAt ? new Date(lead.application.completedAt).toLocaleDateString() : 'N/A',
        'Email Consent': lead.communication.emailConsent ? 'Yes' : 'No',
        'SMS Consent': lead.communication.smsConsent ? 'Yes' : 'No',
        'Digital Signature Given': lead.communication.consentGiven ? 'Yes' : 'No',
        'Lead Created Date': new Date(lead.createdAt).toLocaleDateString(),
        'Last Activity': new Date(lead.lastActivity).toLocaleDateString(),
        'Age in Days': lead.ageInDays,
        'Time in Current Status (Days)': lead.timeInCurrentStatus
      }));

      // Generate CSV
      const fields = Object.keys(csvData[0]);
      const parser = new Parser({ fields });
      const csv = parser.parse(csvData);

      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`);
      
      res.status(200).send(csv);

    } catch (error) {
      console.error('Export Leads Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export leads',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get conversion funnel analytics (Use Case D)
   * GET /api/admin/leads/analytics
   */
  async getLeadAnalytics(req, res) {
    try {
      const { eventId, startDate, endDate } = req.query;

      // Build filter
      const filter = {};
      if (eventId) filter.eventId = eventId;
      if (startDate) filter.createdAt = { $gte: new Date(startDate) };
      if (endDate) filter.createdAt = { $lte: new Date(endDate) };

      // Get overall statistics
      const overallStats = await AdminLead.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get daily registration trends
      const dailyTrends = await AdminLead.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              status: '$status'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.date': 1 } }
      ]);

      // Get college-wise breakdown
      const collegeBreakdown = await AdminLead.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$studentInfo.college',
            totalLeads: { $sum: 1 },
            completedLeads: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            }
          }
        },
        {
          $addFields: {
            completionRate: {
              $multiply: [
                { $divide: ['$completedLeads', '$totalLeads'] },
                100
              ]
            }
          }
        },
        { $sort: { totalLeads: -1 } }
      ]);

      // Get field of study breakdown
      const fieldBreakdown = await AdminLead.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$studentInfo.fieldOfStudy',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Convert overall stats to object
      const statusCounts = {};
      overallStats.forEach(stat => {
        statusCounts[stat._id] = stat.count;
      });

      const totalLeads = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

      res.status(200).json({
        success: true,
        message: 'Lead analytics retrieved successfully',
        data: {
          overallStats: {
            totalLeads,
            statusCounts,
            conversionRates: {
              registered: totalLeads > 0 ? ((statusCounts.registered || 0) / totalLeads * 100).toFixed(2) : 0,
              started: totalLeads > 0 ? ((statusCounts.started || 0) / totalLeads * 100).toFixed(2) : 0,
              completed: totalLeads > 0 ? ((statusCounts.completed || 0) / totalLeads * 100).toFixed(2) : 0,
              dropped: totalLeads > 0 ? ((statusCounts.dropped || 0) / totalLeads * 100).toFixed(2) : 0
            }
          },
          dailyTrends,
          collegeBreakdown: collegeBreakdown.slice(0, 10), // Top 10 colleges
          fieldBreakdown: fieldBreakdown.slice(0, 10), // Top 10 fields
          summary: {
            averageCompletionRate: collegeBreakdown.length > 0 
              ? (collegeBreakdown.reduce((sum, college) => sum + college.completionRate, 0) / collegeBreakdown.length).toFixed(2)
              : 0,
            topCollege: collegeBreakdown[0] || null,
            topField: fieldBreakdown[0] || null
          }
        }
      });

    } catch (error) {
      console.error('Get Lead Analytics Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve lead analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new AdminLeadController();
