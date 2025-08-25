const mongoose = require('mongoose');

/**
 * AdminLead Model - For tracking student interest and conversion funnel
 * This model tracks the journey: Registered → Started → Completed
 */
const adminLeadSchema = new mongoose.Schema({
  // Unique lead identifier
  leadId: {
    type: String,
    required: [true, 'Lead ID is required'],
    unique: true,
    trim: true,
    // Format: LEAD-YYYY-MMDD-XXX (e.g., LEAD-2024-01-15-001)
    match: [/^LEAD-\d{4}-\d{2}-\d{2}-\d{3}$/, 'Invalid lead ID format']
  },
  
  // Link to the event this lead is interested in
  eventId: {
    type: String,
    required: [true, 'Event ID is required'],
    trim: true,
    ref: 'AdminEvent'
  },
  
  // Student information (encrypted for security)
  studentInfo: {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    
    email: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    
    phone: {
      type: String,
      required: [true, 'Student phone is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      maxlength: [200, 'College name cannot exceed 200 characters']
    },
    
    year: {
      type: String,
      required: [true, 'Year of study is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Other'],
      default: '1st Year'
    },
    
    fieldOfStudy: {
      type: String,
      required: [true, 'Field of study is required'],
      trim: true,
      maxlength: [100, 'Field of study cannot exceed 100 characters']
    }
  },
  
  // Conversion funnel status
  status: {
    type: String,
    enum: ['registered', 'started', 'completed', 'dropped'],
    default: 'registered',
    required: true
  },
  
  // Status change tracking
  statusHistory: [{
    status: {
      type: String,
      enum: ['registered', 'started', 'completed', 'dropped'],
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: String,
      default: 'system'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes cannot exceed 200 characters']
    }
  }],
  
  // Application tracking
  application: {
    hasStarted: {
      type: Boolean,
      default: false
    },
    
    startedAt: {
      type: Date,
      default: null
    },
    
    hasCompleted: {
      type: Boolean,
      default: false
    },
    
    completedAt: {
      type: Date,
      default: null
    },
    
    // Personalized application link
    applicationLink: {
      type: String,
      trim: true,
      // Will contain unique tracking URL
      default: null
    },
    
    // Application form data (encrypted)
    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  
  // Communication preferences
  communication: {
    emailConsent: {
      type: Boolean,
      default: true
    },
    
    smsConsent: {
      type: Boolean,
      default: true
    },
    
    preferredContact: {
      type: String,
      enum: ['email', 'sms', 'both'],
      default: 'email'
    },
    
    // Digital signature and consent
    digitalSignature: {
      type: String,
      default: null
    },
    
    consentGiven: {
      type: Boolean,
      default: false
    },
    
    consentDate: {
      type: Date,
      default: null
    }
  },
  
  // Source tracking
  source: {
    eventLink: {
      type: String,
      trim: true
    },
    
    referrer: {
      type: String,
      trim: true
    },
    
    utmSource: {
      type: String,
      trim: true
    },
    
    utmMedium: {
      type: String,
      trim: true
    },
    
    utmCampaign: {
      type: String,
      trim: true
    }
  },
  
  // Admin notes and actions
  adminNotes: [{
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters']
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tags for categorization
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  // Additional metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'admin_leads' // Explicit collection name to avoid conflicts
});

// Indexes for better query performance
adminLeadSchema.index({ leadId: 1 });
adminLeadSchema.index({ eventId: 1 });
adminLeadSchema.index({ status: 1 });
adminLeadSchema.index({ 'studentInfo.email': 1 });
adminLeadSchema.index({ 'studentInfo.phone': 1 });
adminLeadSchema.index({ createdAt: 1 });
adminLeadSchema.index({ lastActivity: 1 });

// Virtual for lead age in days
adminLeadSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for time in current status
adminLeadSchema.virtual('timeInCurrentStatus').get(function() {
  if (this.statusHistory.length === 0) return 0;
  
  const currentStatus = this.statusHistory[this.statusHistory.length - 1];
  const now = new Date();
  const diffTime = Math.abs(now - currentStatus.changedAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update status history
adminLeadSchema.pre('save', function(next) {
  // If status changed, add to history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: 'system'
    });
  }
  
  // Update last activity
  this.lastActivity = new Date();
  
  next();
});

// Method to generate next lead ID
adminLeadSchema.statics.generateLeadId = function() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Simple implementation - in production, you might want more sophisticated ID generation
  return `LEAD-${dateStr}-001`;
};

// Method to update lead status
adminLeadSchema.methods.updateStatus = function(newStatus, adminUserId, notes = '') {
  this.status = newStatus;
  
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy: adminUserId ? adminUserId.toString() : 'system',
    notes: notes
  });
  
  // Update application tracking
  if (newStatus === 'started') {
    this.application.hasStarted = true;
    this.application.startedAt = new Date();
  } else if (newStatus === 'completed') {
    this.application.hasCompleted = true;
    this.application.completedAt = new Date();
  }
  
  return this.save();
};

// Method to add admin note
adminLeadSchema.methods.addAdminNote = function(note, adminUserId) {
  this.adminNotes.push({
    note: note,
    addedBy: adminUserId,
    addedAt: new Date()
  });
  
  return this.save();
};

// Method to get lead summary
adminLeadSchema.methods.getSummary = function() {
  return {
    leadId: this.leadId,
    eventId: this.eventId,
    studentName: this.studentInfo.name,
    studentEmail: this.studentInfo.email,
    status: this.status,
    ageInDays: this.ageInDays,
    timeInCurrentStatus: this.timeInCurrentStatus,
    hasStarted: this.application.hasStarted,
    hasCompleted: this.application.hasCompleted,
    createdAt: this.createdAt,
    lastActivity: this.lastActivity
  };
};

module.exports = mongoose.model('AdminLead', adminLeadSchema);
