exports.addArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const images = req.files.map((file) => file.path); // Cloudinary returns the full URL in `file.path`

    const { collection: articles } = await databaseConnect("Articles");
    const newArticle = { title, content, images, createdAt: new Date() };

    await articles.insertOne(newArticle);

    res
      .status(201)
      .json({ message: "Article added successfully", article: newArticle });
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

    // Cloudinary URLs
    const coverPhoto = req.files.coverPhoto
      ? req.files.coverPhoto[0].path
      : null;
    const inGameCaptures = req.files["inGameCaptures[]"]
      ? req.files["inGameCaptures[]"].map((file) => file.path)
      : [];

    const { collection: games } = await databaseConnect("Games");

    const newGame = {
      gameName,
      category,
      userRating: 0,
      usersRated: 0,
      releaseDate,
      platforms: JSON.parse(platforms),
      awards,
      description,
      introSentence,
      ageRating,
      coverPhoto,
      inGameCaptures,
      createdAt: new Date(),
    };

    await games.insertOne(newGame);

    res.status(201).json({ message: "Game added successfully", game: newGame });
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ message: "Failed to add game" });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    const { collection: games } = await databaseConnect("Games");

    // OF THERE ARE REVIEWS< TEHY SHOULD DELETE TOO!

    const result = await games.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

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

    const { collection: games } = await databaseConnect("Games");

    const result = await games.updateOne(
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
