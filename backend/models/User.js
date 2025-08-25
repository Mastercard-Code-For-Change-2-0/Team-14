const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // exclude by default
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    YearOfGraduation: {
      type: String,
      required: true,
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "B.Tech - Computer Engineering",
        "B.Tech - Information Technology",
        "B.Tech - Electronics & Telecommunication Engineering",
        "B.Tech - Electronics & Computer Engineering",
        "B.Tech - Mechanical Engineering",
      ],
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    lastLogin: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Virtual fullName field
userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Public profile (safe version)
userSchema.methods.getPublicProfile = function () {
  const { _id, username, email, firstName, lastName, role, phone, college, YearOfGraduation, fieldOfStudy, isActive } =
    this;
  return {
    id: _id,
    username,
    email,
    firstName,
    lastName,
    role,
    phone,
    college,
    YearOfGraduation,
    fieldOfStudy,
    isActive,
  };
};

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
