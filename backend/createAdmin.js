const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function createAdmin() {
  try {
    // Find the admin user by email
    const adminUser = await User.findOne({ email: 'admin@katalyst.com' });
    
    if (!adminUser) {
      console.log('Admin user not found. Please create the user first.');
      return;
    }

    // Update the user role to admin
    adminUser.role = 'admin';
    await adminUser.save();

    console.log('User role updated to admin successfully!');
    console.log('Email:', adminUser.email);
    console.log(' Username:', adminUser.username);
    console.log('Role:', adminUser.role);
    
    // Close the connection
    mongoose.connection.close();
    
  } catch (error) {
    console.error(' Error updating user role:', error);
    mongoose.connection.close();
  }
}

createAdmin();
