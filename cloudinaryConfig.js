// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dtftt3fil', // Replace with your Cloudinary cloud name
  api_key: '362918788951647',       // Replace with your Cloudinary API key
  api_secret: 'Q-s55BKT4ZR-bIOlhBNzL6om3_Q'  // Replace with your Cloudinary API secret
});

module.exports = cloudinary;
