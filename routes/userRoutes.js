const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/signUp", userController.signUp);

router.post("/logIn", userController.logIn);

server.get('/articles', userController.getArticles);


server.get('/games', userController.getGames);

server.get('/games/:id', userController.getGameInfo);


server.post('/add-review', userController.postReview);

server.get('/reviews/:gameId', userController.getReviews);
    

module.exports = router;
