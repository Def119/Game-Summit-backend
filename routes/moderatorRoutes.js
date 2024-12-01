import express from 'express';
const router = express.Router();

import {deleteGame,updateGame,fetchArticles,updateArticle,deleteArticle,addArticle} from '../controllers/moderatorController'; 
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import auth from '../authentication/userAuth';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "your_folder_name", // Name of the folder to store the images in Cloudinary
    allowedFormats: ["jpg", "png"], // Specify allowed formats
  },
});

const upload = multer({ storage });

router.post(
  "/add-article",
  upload.array("images", 5),
  addArticle
);

router.delete("/games/:id",deleteGame);

router.put("/games/:id",updateGame);

router.post(
  "/add-game",
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "inGameCaptures[]", maxCount: 5 },
  ]),
  postGame
);

router.get("/fetchArticles",fetchArticles);

router.put('/articles/:id', updateArticle);

router.delete('/articles/:id', deleteArticle);

export default router;
