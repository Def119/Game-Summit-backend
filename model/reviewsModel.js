const mongoose = require("mongoose");
const db = mongoose.connection.useDb("GameSummit");

const reviewSchema = new mongoose.Schema({
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = db.model("Review", reviewSchema);

module.exports = Review;
