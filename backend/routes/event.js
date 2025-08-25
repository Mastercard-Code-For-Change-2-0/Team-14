const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  getEvents,
  getEventById,
  markInterested,
  markRegistered,
  markCompleted,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
} = require("../controllers/eventController");

// ========================
// Public routes
// ========================
router.get("/", getEvents);
router.get("/:id", getEventById);

// ========================
// Protected student actions
// ========================
router.post("/:id/interested", protect, markInterested);
router.post("/:id/register", protect, markRegistered);
router.post("/:id/complete", protect, markCompleted);

// ========================
// Admin routes
// ========================
router.post("/", protect, authorize("admin"), createEvent); // Create new event
router.put("/:id", protect, authorize("admin"), updateEvent); // Update event
router.delete("/:id", protect, authorize("admin"), deleteEvent); // Delete event
router.get("/:id/stats", protect, authorize("admin"), getEventStats); // Event stats

module.exports = router;
