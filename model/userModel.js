import mongoose from "mongoose";

import bcrypt from "bcrypt";

const db = mongoose.connection.useDb("GameSummit");

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

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.statics.login = async function (email, candidatePassword) {
  try {
    const user = await this.findOne({
      email: email,
    });

    if (!user) {
      throw new Error("User not found");
    }

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

export default User;
