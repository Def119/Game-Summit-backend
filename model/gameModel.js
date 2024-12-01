import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Use the specific database for GameSummit
const db = mongoose.connection.useDb("GameSummit");

// Define the schema for the game
const gameSchema = new Schema({
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
    type: String,
    default: "None", // Single string field, default value is "None"
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
  coverPhoto: {
    type: String,
    required: true,
  },
  inGameCaptures: {
    type: [String], // Array of strings for image URLs
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default to current date/time if not provided
  },
});

// Create the model using the defined schema
const Game = db.model("Games", gameSchema);

export default Game;
