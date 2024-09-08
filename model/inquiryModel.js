const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Use the specific database for GameSummit
const db = mongoose.connection.useDb("GameSummit");

// Define the schema for the inquiry
const inquirySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: /.+\@.+\..+/ //regex to validate email format
  },
  message: {
    type: String,
    required: true,
  },
  readFlag: {
    type: Boolean,
    default: false // Default to false indicating the inquiry has not been read
  },
  dateAndTime: {
    type: Date,
    default: Date.now 
  }
});

// Create a model from the schema
const Inquiry = db.model("Inquiry", inquirySchema);

module.exports = Inquiry;
