import mongoose from "mongoose";
import Article from "../model/articleModel";
import Game from "../model/gameModel";
import Review from "../model/reviewsModel";

export const addArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const images = req.files.map((file) => file.path); // Get the file paths from uploaded files

    // Create a new article instance
    const newArticle = new Article({
      title,
      content,
      images,
      createdAt: new Date(),
    });

    // Save the new article to the database
    const savedArticle = await newArticle.save();

    res
      .status(201)
      .json({ message: "Article added successfully", article: savedArticle });
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).json({ message: "Failed to add article" });
  }
};

export const postGame = async (req, res) => {
  try {
    const {
      gameName,
      category,
      releaseDate,
      platforms,
      awards,
      description,
      introSentence,
      ageRating,
    } = req.body;

    // Cloudinary URLs for cover photo and in-game captures
    const coverPhoto = req.files.coverPhoto
      ? req.files.coverPhoto[0].path
      : null;
    const inGameCaptures = req.files["inGameCaptures[]"]
      ? req.files["inGameCaptures[]"].map((file) => file.path)
      : [];

    // Create a new game instance using the Game model
    const newGame = new Game({
      gameName,
      category,
      userRating: 0, // Initial rating value
      usersRated: 0, // Initial number of ratings
      releaseDate,
      platforms: JSON.parse(platforms), // Parse platforms if it's sent as a JSON string
      awards: awards || ["None"], // Use default if awards not provided
      description,
      introSentence,
      ageRating,
      coverPhoto, // Add cover photo URL
      inGameCaptures, // Add in-game capture URLs
    });

    // Save the new game to the database
    const savedGame = await newGame.save();

    res
      .status(201)
      .json({ message: "Game added successfully", game: savedGame });
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ message: "Failed to add game" });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid game ID format" });
    }

    // Check if the game exists
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Delete associated reviews if there are any
    await Review.deleteMany({ gameId: id });

    // Delete the game
    await Game.findByIdAndDelete(id);

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ message: "Failed to delete game" });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGame = req.body;
    delete updatedGame._id;

    const result = await Game.updateOne({ _id: id }, { $set: updatedGame });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ message: "Game updated successfully" });
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ message: "Failed to update game" });
  }
};

///search articles to manage
export const fetchArticles = async (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query parameter
  console.log(searchTerm);

  try {
    let articlesList;

    if (searchTerm) {
      // Perform a case-insensitive search on the title field and select the desired fields
      articlesList = await Article.find(
        { title: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search
        "title content images createdAt" // Fields to include
      ).exec(); // Execute the query
    } else {
      // Fetch all articles, sort by createdAt, limit to 12, and select the desired fields
      articlesList = await Article.find(
        {}, // No filter, get all documents
        "title content images createdAt" // Fields to include
      )
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .limit(12) // Limit to 12 results
        .exec(); // Execute the query
    }

    // Send the filtered list of articles as the response
    res.status(200).json(articlesList);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

export const updateArticle = async (req, res) => {
  const articleId = req.params.id; // Get the article ID from the URL
  const updatedData = req.body; // Get the updated article data from the request body

  console.log("Updating article with ID:", articleId);
  console.log("Updated data:", updatedData);

  try {
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ message: "Invalid article ID format" });
    }

    // Find the article by ID and update it with the new data
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      updatedData
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Return the updated article
    res
      .status(200)
      .json({ message: "Article updated successfully", updatedArticle });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Failed to update article" });
  }
};

export const deleteArticle = async (req, res) => {
  const articleId = req.params.id; // Get the article ID from the URL

  console.log("Deleting article with ID:", articleId);

  try {
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ message: "Invalid article ID format" });
    }

    // Find the article by ID and delete it
    const deletedArticle = await Article.findByIdAndDelete(articleId);

    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
};
