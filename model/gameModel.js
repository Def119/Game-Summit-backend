const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;



const db = mongoose.connection.useDb("GameSummit");
// Define the schema for the game
const gameSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userRating: {
    type: Number,
    required: true,
  },
  usersRated: {
    type: Number,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  platforms: {
    type: [String],
    required: true,
  },
  awards: {
    type: [String],
    default: ['None'], // Default value if not provided
  },
  description: {
    type: String,
    required: true,
  },
  introSentence: {
    type: String,
    required: true,
  },
  ageRating: {
    type: String,
    required: true,
  },
});

const Game = db.model("Games", gameSchema);
// Export the model to use it in other parts of the application
module.exports = Game;
