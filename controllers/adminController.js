import Moderator from "../model/moderatorModel";
import Inquiry from "../model/inquiryModel";
import User from "../model/userModel";

export const addModerators = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the moderator already exists
    const existingModerator = await Moderator.findOne({ email });
    if (existingModerator) {
      return res.status(400).json({ message: "Moderator already exists" });
    }

    // Create a new Moderator instance
    const newModerator = new Moderator({ name, email, password });

    // Save the new moderator to the database
    const savedModerator = await newModerator.save();

    // Return the response with the inserted moderator's ID
    res.status(201).json({
      message: "Moderator added successfully",
      insertedId: savedModerator._id,
    });
  } catch (error) {
    console.error("Error adding moderator:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getModerators = async (req, res) => {
  try {
    const allModerators = await Moderator.find({});
    res.status(200).json(allModerators);
  } catch (error) {
    console.error("Error fetching moderators:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteModerator = async (req, res) => {
  const { id } = req.params;

  try {
    // Mongoose automatically converts string ID to ObjectId
    const result = await Moderator.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Moderator removed successfully." });
    } else {
      res.status(404).json({ message: "Moderator not found." });
    }
  } catch (error) {
    console.error("Error deleting moderator:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const allInquiries = await Inquiry.find({}).sort({ readFlag: 1, date: -1 }); //unreviewed and latest  first
    res.status(200).json(allInquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const reviewInquiry = async (req, res) => {
  try {
    const inquiryId = req.params.id;
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { readFlag: true },
      { new: true }
    );

    if (!updatedInquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({ success: true, data: updatedInquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInquiryFlag = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { readFlag: true },
      { new: true } // Return the updated document
    );

    if (!updatedInquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({
      message: "Inquiry updated successfully",
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    res.status(500).json({ message: "Failed to update inquiry" });
  }
};

export const getUsers = async (req, res) => {
  const query = req.query.query;

  console.log(query);
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } }, // case-insensitive search
        { email: { $regex: query, $options: "i" } },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  console.log("Deleting user with ID:", userId);
  try {
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
