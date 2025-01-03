import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import Review from "../model/reviewsModel.js";
import Moderator from "../model/moderatorModel.js";
import Article from "../model/articleModel.js";
import Game from "../model/gameModel.js";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  
  let user = null;
  let moderator = false;
  let admin = false;
  let userId = null;

  try {
    // Attempt to log in as a regular user
    try {
      user = await User.login(email, password);
      userId = user?.id;
    } catch (error) {
      console.error("Error logging in user:", error);
    }

    // If not a regular user, attempt to log in as a moderator
    if (!user) {
      try {
        user = await Moderator.login(email, password);
        if (user) moderator = true;
        userId = user?.id;
      } catch (error) {
        console.error("Error logging in moderator:", error);
      }
    }

    if (!user && !moderator) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPasswordHash = process.env.ADMIN_PASSWORD;

      // email compare  for admin check
      if (email === adminEmail) {
      
        const isMatch = await bcrypt.compare(password, adminPasswordHash);
        

        if (isMatch) {
          admin = true;
        }
      }
    }

    // If no valid user was found, return an error
    if (!user && !admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token with the user data
    const token = jwt.sign({ userId, moderator, admin }, SECRET_KEY, {
      expiresIn: "8h",
    });

    // Return the token along with user data
    return res.json({ moderator, admin, token });
  } catch (error) {
    console.error("Error in login process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    

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
      { expiresIn: "8h" } // Set token expiration time
    );

    // Return the token along with a success message
    res.status(201).json({ message: "User signed up successfully", token });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGames = async (req, res) => {
  const searchTerm = req.query.q;



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

export const getGameInfo = async (req, res) => {
  const gameId = req.params.id; // Get the game ID from the request parameters

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

export const postReview = async (req, res) => {
  try {
    const { id, reviewText, rating } = req.body;
    const { userId } = req.user;


    if (!id) {
      return res.status(400).json({ error: "Game ID is required" });
    }

    // Create the review object
    const newReview = new Review({
      gameId: id,
      userId: userId,
      reviewText,
      rating: Number(rating),
      createdAt: new Date(),
    });

    console.log("gonna run save");
    // Save the new review
    await newReview.save();
    console.log("ran save");
    // Update the game's rating and number of users rated
    const game = await Game.findOne({ _id: id });


    if (game) {
      const newUserRating =
        (game.userRating * game.usersRated + Number(rating)) /
        (game.usersRated + 1);

      await Game.updateOne(
        { _id: id },
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

import { Types } from "mongoose";
const { ObjectId } = Types;

export const getReviews = async (req, res) => {
  const { gameId } = req.params;

  try {
    // Convert to ObjectId if necessary
    const query = {
      gameId: ObjectId.isValid(gameId) ? new ObjectId(gameId) : gameId,
    };

    const reviews = await Review.find(
      query,
      "reviewText rating createdAt"
    ).limit(7);

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getArticles = async (req, res) => {
  try {
    const articleList = await Article.find().limit(20);

    res.status(200).json(articleList);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

export const getArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const postInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newInquiry = new Inquiry({
      name,
      email,
      message,
    });
   
    await newInquiry.save();

    // Respond with the created inquiry
    res.status(201).json({
      message: "Inquiry created successfully",
      inquiry: newInquiry,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Failed to create inquiry" });
  }
};

// Check if a user has already reviewed a game
export const checkExistingReview = async (req, res) => {
  try {
    const { id: gameId } = req.params;
    const { userId } = req.user;

   

    const gameObjectId = new mongoose.Types.ObjectId(gameId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const existingReview = await Review.findOne({
      gameId: gameObjectId,
      userId: userObjectId,
    });

    res.json({ hasReviewed: !!existingReview });
  } catch (error) {
    console.error("Error checking existing review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id: gameId } = req.params;
    const { userId } = req.user;

 

    const gameObjectId = new mongoose.Types.ObjectId(gameId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find and delete the review
    const review = await Review.findOneAndDelete({
      gameId: gameObjectId,
      userId: userObjectId,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Fetch the corresponding game
    const game = await Game.findById(gameObjectId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Recalculate the overall userRating
    const currentTotalRating = game.userRating * game.usersRated;
    const newUsersRated = game.usersRated - 1;

    // Avoid division by zero when there are no users left
    const newUserRating =
      newUsersRated > 0
        ? (currentTotalRating - review.rating) / newUsersRated
        : 0;

    // Update the game with the new rating and usersRated count
    await Game.updateOne(
      { _id: gameObjectId },
      { $set: { userRating: newUserRating, usersRated: newUsersRated } }
    );

    res.json({
      message: "Review deleted and game rating updated successfully",
    });
  } catch (error) {
    console.error("Error deleting review and updating game rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};
