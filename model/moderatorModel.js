const mongoose = require("mongoose");

const db = mongoose.connection.useDb("GameSummit");

// Define the schema for the user (clone model)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Enforces unique email addresses
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); 

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
      throw new Error("Moderator not found");
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

const Moderator = db.model("Moderator", userSchema);

module.exports = Moderator;
