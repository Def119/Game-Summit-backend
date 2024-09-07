const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); 
const SECRET_KEY = "your_secret_key"; 

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    console.log(req.body);

    // Check if the user already exists
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
    const user = await User.login(email, password); // Assuming this returns user data if login is successful

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id }, // Include payload data, e.g., user ID
      SECRET_KEY,
      { expiresIn: "1h" } // Set token expiration time
    );

    // Return the token along with user data
    return res.json({ user, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGames = async (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query parameter
  console.log(searchTerm);

  try {
    const { collection: games } = await databaseConnect("Games"); // Connect to the database

    let gamesList;

    if (searchTerm) {
      // Perform a case-insensitive search on the gameName field and project the desired fields
      gamesList = await games
        .find(
          { gameName: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search
          {
            projection: {
              gameName: 1,
              userRating: 1,
              image: 1,
              category: 1,
              coverPhoto: 1,
            },
          } // Include only these fields
        )
        .toArray(); // Convert the result to an array
    } else {
      // Fetch all games, sort by userRating, limit to 12, and project the desired fields
      gamesList = await games
        .find(
          {}, // No filter, get all documents
          { projection: { gameName: 1, userRating: 1, image: 1, category: 1 } } // Include only these fields
        )
        .sort({ userRating: -1 }) // Sort by rating in descending order
        .limit(12)
        .toArray(); // Convert the result to an array
    }

    // Send the filtered list of games as the response
    res.status(200).json(gamesList);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ message: "Failed to fetch games" });
  }
};

exports.getGameInfo = async (req, res) => {
  let gameId = req.params.id; // Get the game ID from the request parameters
  console.log(gameId);

  try {
    const { collection: games } = await databaseConnect("Games");

    // Convert the string ID to ObjectId
    const gameObjectId = new ObjectId(gameId);
    console.log(gameObjectId);
    const game = await games.findOne({ _id: gameObjectId });

    if (game) {
      console.log(game.json);
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

    const { collection: reviews } = await databaseConnect("Reviews");
    const { collection: games } = await databaseConnect("Games");

    // Create the review object
    const newReview = {
      id,
      reviewText,
      rating: Number(rating),
      createdAt: new Date(),
    };

    // Insert the new review
    await reviews.insertOne(newReview);

    // Update the game's rating and number of users rated
    const game = await games.findOne({ _id: new ObjectId(id) });

    if (game) {
      const newUserRating =
        (game.userRating * game.usersRated + Number(rating)) /
        (game.usersRated + 1);
      await games.updateOne(
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
  console.log("gae id is " + gameId);
  try {
    const { collection: reviewsCollection } = await databaseConnect("Reviews"); // Connect to the Reviews collection

    // Fetch up to 7 reviews for the given gameId
    const reviews = await reviewsCollection
      .find(
        { id: gameId },
        { projection: { reviewText: 1, rating: 1, createdAt: 1 } }
      ) // Adjust the fields as needed
      .limit(7) // Limit the results to 7 reviews
      .toArray();

    console.log("enne nane" + reviews);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const { collection: articles } = await databaseConnect("Articles");

    const articleList = await articles.find().toArray();
    res.status(200).json(articleList);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};
