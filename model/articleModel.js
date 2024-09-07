const mongoose = require("mongoose");

// Define the schema for the article
const db = mongoose.connection.useDb("GameSummit");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String], 
    
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});




const Article = db.model("Article", articleSchema);


module.exports = Article;
