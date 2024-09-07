const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderatorController");



router.post('/add-article', upload.array('images', 5),moderatorController.addArticle);


router.delete('/games/:id', moderatorController.deleteGame);

router.put('/games/:id', moderatorController.updateGame );
  



router.post('/add-game', upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'inGameCaptures[]', maxCount: 5 },
  ]), moderatorController.postGame);
  