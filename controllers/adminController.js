const Moderator = require("../model/moderatorModel");


exports.addModerators = async (req, res) => {
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

exports.getModerators = async (req, res) => {
    try {
      const allModerators = await Moderator.find({}); // No need to use toArray()
      res.status(200).json(allModerators);
    } catch (error) {
      console.error("Error fetching moderators:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  


  exports.deleteModerator = async (req, res) => {
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
