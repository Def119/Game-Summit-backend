

exports.logIn = async (req, res) => {   
    const { email, password } = req.body;   
    let user;   let moderator = false;   
    let admin = false;    
    try {     
      try {       // Attempt to log in as a regular user       
    user = await User.login(email, password);     
  } catch (error) {       
    console.error("Error logging in user:", error);     
  }      
  if (!user) {       
    try {        
  
       // If not a regular user, attempt to log in as a moderator       
         user = await Moderator.login(email, password);        
          moderator = true;       
        }catch (error) {        
             console.error("Error logging in moderator:", error);       
            }     
          }            
          if (!moderator) {       
            console.log(password);       
            console.log(process.env.ADMIN_PASSWORD);        
            const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);       
            admin = isMatch;     
          }      
         // Use the user ID safely     
         const userId = user?.id; // Safely access user.id     // Generate a JWT token with the user data    
          const token = jwt.sign(       
            { userId, moderator, admin }, // Payload with user ID and roles       
            SECRET_KEY,       
            { expiresIn: "8h" } // Token expiration time    
             );      // Return the token along with user data     
             return res.json({ moderator, admin, token });  
             } catch (error) {     
              console.error("Error logging in user:", error);     
              res.status(500).json({ message: "Internal server error" });   
            } };
  