const User = require("../model/userModel");
const Moderator = require("../model/moderatorModel");

const Article = require("../model/articleModel");
const Game = require("../model/gameModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";
const mongoose = require("mongoose");

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    console.log(req.body);

    // Check if the user already existsW
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Insert the new user into the Users collection
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { userId: newUser.id }, // Include payload data, e.g., user ID
      SECRET_KEY,
      { expiresIn: "1h" } // Set token expiration time
    );

    // Return the token along with a success message
    res.status(201).json({ message: "User signed up successfully", token });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const moderator = false;
    if (!user) {
      user = await Moderator.login(email, password);
      moderator = true;
    }

    const token = jwt.sign(
      { userId: user.id, moderator: moderator ,admin:false }, // Include payload data, e.g., user ID
      SECRET_KEY,
      { expiresIn: "1h" } // Set token expiration time
    );

    // Return the token along with user data
    return res.json({ moderator: moderator,admin:false, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGames = async (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query parameter
  console.log(searchTerm);

  try {
    let gamesList;

    if (searchTerm) {
      // Perform a case-insensitive search on the gameName field and select the desired fields
      gamesList = await Game.find(
        { gameName: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search
        "gameName userRating image category coverPhoto" // Fields to include
      ).exec(); // Execute the query
    } else {
      // Fetch all games, sort by userRating, limit to 12, and select the desired fields
      gamesList = await Game.find(
        {}, // No filter, get all documents
        "gameName userRating image category coverPhoto" // Fields to include
      )
        .sort({ userRating: -1 }) // Sort by userRating in descending order
        .limit(12) // Limit to 12 results
        .exec(); // Execute the query
    }

    // Send the filtered list of games as the response
    res.status(200).json(gamesList);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ message: "Failed to fetch games" });
  }
};

exports.getGameInfo = async (req, res) => {
  const gameId = req.params.id; // Get the game ID from the request parameters
  console.log(gameId);

  try {
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid game ID format" });
    }

    // Find the game by its ID using Mongoose
    const game = await Game.findById(gameId);

    if (game) {
      res.status(200).json(game);
    } else {
      res.status(404).json({ message: "Game not found" });
    }
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ message: "Failed to fetch game" });
  }
};

exports.postReview = async (req, res) => {
  try {
    const { id, reviewText, rating } = req.body; ///     ADD user ID too ??????

    if (!id) {
      return res.status(400).json({ error: "Game ID is required" });
    }

    // Create the review object
    const newReview = {
      id,
      reviewText,
      rating: Number(rating),
      createdAt: new Date(),
    };

    // Insert the new review
    await Review.insertOne(newReview);

    // Update the game's rating and number of users rated
    const game = await Game.findOne({ _id: new ObjectId(id) });

    if (game) {
      const newUserRating =
        (game.userRating * game.usersRated + Number(rating)) /
        (game.usersRated + 1);

      await Game.updateOne(
        { _id: new ObjectId(id) },
        { $set: { userRating: newUserRating, usersRated: game.usersRated + 1 } }
      );
    }

    res.status(201).json({
      message: "Review and game rating updated successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
};

exports.getReviews = async (req, res) => {
  const { gameId } = req.params;
  //   console.log("gae id is " + gameId);
  try {
    // Fetch up to 7 reviews for the given gameId
    const reviews = await Review.find(
      { id: gameId },
      { projection: { reviewText: 1, rating: 1, createdAt: 1 } }
    ) // Adjust the fields as needed
      .limit(7) // Limit the results to 7 reviews
      .toArray();

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articleList = await Article.find();

    res.status(200).json(articleList);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};
