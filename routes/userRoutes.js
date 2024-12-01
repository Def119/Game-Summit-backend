import express from "express";

import authenticateToken from "../authentication/userAuth.js";

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
  deleteReview,
  checkExistingReview,
} from '../controllers/userController.js';

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

export default router;
