const mongoose = require("mongoose");
const db = mongoose.connection.useDb("GameSummit");

const reviewSchema = new mongoose.Schema({
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true }, // Reference to the Game model
  createdAt: { type: Date, default: Date.now },
});

const Review = db.model("Review", reviewSchema);

module.exports = Review;
