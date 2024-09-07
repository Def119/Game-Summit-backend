const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const db = mongoose.connection.useDb("GameSummit");

// Define the schema for the user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// Static method to handle user login
userSchema.statics.login = async function (email, candidatePassword) {
  try {
    // Find the user by email or username
    const user = await this.findOne({
      email: email
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(candidatePassword, user.password);

    if (!isMatch) {
      throw new Error("Incorrect password");
    }

    return user;
  } catch (err) {
    throw err;
  }
};

// Create the User model
const User = db.model("Users", userSchema);

// Export the model to use it in other parts of the application
module.exports = User;
