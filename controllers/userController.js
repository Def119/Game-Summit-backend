const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
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
    const user = await User.login(email, password); 

   
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

   
    return res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addModerators = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { collection: moderators } = await databaseConnect("Moderators");

    // Check if the moderator already exists
    const existingModerator = await moderators.findOne({ email });
    if (existingModerator) {
      return res.status(400).json({ message: "Moderator already exists" });
    }

    // Insert the new moderator into the Moderators collection
    const result = await moderators.insertOne({ name, email, password });
    res.status(201).json({
      message: "Moderator added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding moderator:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
