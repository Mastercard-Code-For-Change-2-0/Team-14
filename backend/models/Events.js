const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Event name cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Description too long"]
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true
    },
    location: {
      type: String,
      trim: true,
      default: "Online"
    },
    duration: {
      type: String, // e.g., "2 hours" or "3 days"
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    tags: [
      {
        type: String,
        enum: [
          "education",
          "finance",
          "co-curriculum",
          "personality",
          "sports",
          "tech",
          "others"
        ]
      }
    ],

    // Engagement counts
    interestedStudents: {
      type: Number,
      default: 0
    },
    registeredStudents: {
      type: Number,
      default: 0
    },
    completedStudents: {
      type: Number,
      default: 0
    },

    // Secure event code
    uniqueEventCode: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Static method to generate a unique eventId
eventSchema.statics.generateEventId = async function () {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  let counter = 1;
  let newId;

  do {
    newId = `KAT-${dateStr}-${String(counter).padStart(3, "0")}`;
    const existing = await this.findOne({ eventId: newId });
    if (!existing) break;  // unique found
    counter++;
  } while (true);

  return newId;
};

// Increment interested count
eventSchema.methods.incrementInterested = async function () {
  this.interestedStudents += 1;
  return this.save();
};

// Increment registered count
eventSchema.methods.incrementRegistered = async function () {
  this.registeredStudents += 1;
  return this.save();
};

// Verify event code and increment completed count
eventSchema.methods.markCompleted = async function (enteredCode) {
  if (enteredCode === this.uniqueEventCode) {
    this.completedStudents += 1;
    return this.save();
  } else {
    throw new Error("Invalid event code");
  }
};

module.exports = mongoose.model("Event", eventSchema);
