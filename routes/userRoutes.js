import express from "express";
import router from "../authentication/userAuth";
import authenticateToken from "../authentication/userAuth";

const router = express.Router();

import {
  signUp,
  logIn,
  getArticles,
  getGames,
  getGameInfo,
  postReview,
  getReviews,
  getArticle,
  postInquiry,
  postInquiry,
  deleteReview,
  checkExistingReview,
} from '"../controllers/userController';

router.post("/signUp", signUp);

router.post("/logIn", logIn);

router.get("/articles", getArticles);

router.get("/games", getGames);

router.get("/games/:id", getGameInfo);

router.post("/add-review", authenticateToken, postReview);

router.get("/reviews/:gameId", getReviews);

router.get("/articles/:articleId", getArticle);

router.post("/contact", postInquiry);

router.delete("/reviews/:id", authenticateToken, deleteReview);

router.get("/reviews/exists/:id", authenticateToken, checkExistingReview);

module.exports = router;
