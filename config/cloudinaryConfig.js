import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.API_KEY, // Replace with your Cloudinary API key
  api_secret: process.env.API_SECRETE, // Replace with your Cloudinary API secret
});

export default cloudinary;
