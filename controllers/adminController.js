
exports.addModerators=async (req,res)=>{
    const { name, email, password } = req.body;
    try {
        const { collection: moderators } = await databaseConnect("Moderators"); 
        
        // Check if the moderator already exists
        const existingModerator = await moderators.findOne({ email });
        if (existingModerator) {
            return res.status(400).json({ message: 'Moderator already exists' });
        }

        // Insert the new moderator into the Moderators collection
        const result = await moderators.insertOne({ name, email, password });
        res.status(201).json({ message: 'Moderator added successfully', insertedId: result.insertedId });
    } catch (error) {
        console.error('Error adding moderator:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
} 


exports.getModerators =  async (req, res) => {
    try {
        const {collection:moderators} = await databaseConnect('Moderators');
        const allModerators = await moderators.find().toArray(); // Fetch all moderators
        res.status(200).json(allModerators);
    } catch (error) {
        console.error('Error fetching moderators:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.deleteModerator =async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const { collection:moderators } = await databaseConnect("Moderators");
  
      const result = await moderators.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Moderator removed successfully.' });
      } else {
        res.status(404).json({ message: 'Moderator not found.' });
      }
    } catch (error) {
      console.error('Error deleting moderator:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

