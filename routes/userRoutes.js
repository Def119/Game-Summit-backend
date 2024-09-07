const express = require("express");
const router = express.Router();
const auth = require('../authentication/userAuth')

const userController = require("../controllers/userController");

router.post("/signUp", userController.signUp);

router.post("/logIn", userController.logIn);

router.get("/articles", userController.getArticles);

router.get("/games", userController.getGames);

router.get("/games/:id", userController.getGameInfo);

router.post("/add-review",auth,userController.postReview);

router.get("/reviews/:gameId", userController.getReviews);

module.exports = router;
