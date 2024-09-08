const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderatorController");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const auth = require('../authentication/userAuth')

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
  upload.array("images", 5),auth,
  moderatorController.addArticle
);

router.delete("/games/:id",auth ,moderatorController.deleteGame);

router.put("/games/:id",auth ,moderatorController.updateGame);

router.post(
  "/add-game",
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "inGameCaptures[]", maxCount: 5 },
  ]),auth,
  moderatorController.postGame
);

router.get("/fetchArticles",moderatorController.fetchArticles);

router.put('/articles/:id',auth, moderatorController.updateArticle);

router.delete('/articles/:id', auth,moderatorController.deleteArticle);

module.exports = router;
