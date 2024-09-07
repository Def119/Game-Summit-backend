const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderatorController");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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
  moderatorController.addArticle
);

router.delete("/games/:id", moderatorController.deleteGame);

router.put("/games/:id", moderatorController.updateGame);

router.post(
  "/add-game",
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "inGameCaptures[]", maxCount: 5 },
  ]),
  moderatorController.postGame
);

module.exports = router;
