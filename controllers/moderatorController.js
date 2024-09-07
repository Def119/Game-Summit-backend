const Article = require("../model/articleModel");
const Game = require("../model/gameModel");

exports.addArticle = async (req, res) => {
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

exports.postGame = async (req, res) => {
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
    const coverPhoto = req.files.coverPhoto ? req.files.coverPhoto[0].path : null;
    const inGameCaptures = req.files["inGameCaptures[]"]
      ? req.files["inGameCaptures[]"].map((file) => file.path)
      : [];

    // Create a new game instance using the Game model
    const newGame = new Game({
      gameName,
      category,
      userRating: 0,  // Initial rating value
      usersRated: 0,  // Initial number of ratings
      releaseDate,
      platforms: JSON.parse(platforms), // Parse platforms if it's sent as a JSON string
      awards: awards || ['None'], // Use default if awards not provided
      description,
      introSentence,
      ageRating,
      coverPhoto, // Add cover photo URL
      inGameCaptures, // Add in-game capture URLs
    });

    // Save the new game to the database
    const savedGame = await newGame.save();

    res.status(201).json({ message: "Game added successfully", game: savedGame });
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ message: "Failed to add game" });
  }
};

exports.deleteGame = async (req, res) => {
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
    await Review.deleteMany({ gameId: id }); // Adjust the field if reviews are linked differently

    // Delete the game
    await Game.findByIdAndDelete(id);

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ message: "Failed to delete game" });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGame = req.body;
    delete updatedGame._id;


    const result = await Game.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedGame }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ message: "Game updated successfully" });
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ message: "Failed to update game" });
  }
};
