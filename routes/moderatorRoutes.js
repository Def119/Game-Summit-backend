const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderatorController");



server.post('/add-article', upload.array('images', 5),moderatorController.addArticle);


server.delete('/games/:id', moderatorController.deleteGame);

server.put('/games/:id', moderatorController.updateGame );
  



server.post('/add-game', upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'inGameCaptures[]', maxCount: 5 },
  ]), moderatorController.postGame);
  