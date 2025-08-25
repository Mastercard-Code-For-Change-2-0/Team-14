const Event = require("../models/Events");
const AdminLead = require("../models/AdminLead");
const { validationResult } = require("express-validator");

// ================================
// Student / Public Controllers
// ================================

// @desc    Get all events (public)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark event as "interested"
// @route   POST /api/events/:id/interested
// @access  Student (authenticated)
exports.markInterested = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    await event.incrementInterested();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark event as "registered"
// @route   POST /api/events/:id/register
// @access  Student (authenticated)
exports.markRegistered = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    await event.incrementRegistered();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark event as "completed"
// @route   POST /api/events/:id/complete
// @access  Student (authenticated)
exports.markCompleted = async (req, res) => {
  try {
    const { code } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    await event.markCompleted(code);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ================================
// Admin Controllers
// ================================

// @desc    Create a new event
// @route   POST /api/event
// @access  Admin
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const eventId = await Event.generateEventId();
    let finalEventId = eventId;
    let counter = 1;
    while (await Event.findOne({ eventId: finalEventId })) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      finalEventId = `KAT-${dateStr}-${String(counter).padStart(3, "0")}`;
      counter++;
    }

    const newEvent = new Event({
      ...req.body,
      eventId: finalEventId,
      createdBy: req.user.id, // admin user id
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: savedEvent,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:eventId
// @access  Admin
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    delete updateData.eventId;
    delete updateData.createdBy;
    delete updateData.createdAt;

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const updatedEvent = await Event.findOneAndUpdate(
      { eventId },
      { $set: updateData },
      { new: true, runValidators: true, select: "-__v" }
    ).populate("createdBy", "username email");

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event updated", data: updatedEvent });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:eventId
// @access  Admin
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const leadCount = await AdminLead.countDocuments({ eventId });
    if (leadCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete event. ${leadCount} lead(s) exist.`,
      });
    }

    const deletedEvent = await Event.findOneAndDelete({ eventId });
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event deleted", data: deletedEvent });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
};

// @desc    Get event stats
// @route   GET /api/events/:eventId/stats
// @access  Admin
exports.getEventStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const leadStats = await AdminLead.aggregate([
      { $match: { eventId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusCounts = {};
    leadStats.forEach((stat) => (statusCounts[stat._id] = stat.count));

    const totalLeads = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    res.status(200).json({
      success: true,
      message: "Event stats retrieved",
      data: {
        event,
        totalLeads,
        statusCounts,
      },
    });
  } catch (error) {
    console.error("Get Event Stats Error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve stats" });
  }
};
