
const j = require("jsonwebtoken");

const User = require('../model/userModel')


exports.signUp=async (req,res)=>{
    const { username, email, password } = req.body;
    try {
        console.log(req.body);
        
        
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Insert the new user into the Users collection
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User signed up successfully'});
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.logIn=async (req,res)=>{
    const { email, password } = req.body;
    try {
        const data = await User.login(email, password);
        return res.json(data);  
    } catch (error) {
        console.error('Error logging in user:', error);  
        res.status(500).json({ message: 'Internal server error' });
    }
    
} 