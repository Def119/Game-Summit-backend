const mongoose = require("mongoose");

const db = mongoose.connection.useDb("GameSummit");

// Define the schema for the user (clone model)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Enforces unique email addresses
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create a model for the users collection
const Moderator = db.model("Moderator", userSchema);

module.exports = Moderator;
