import express from "express";

import {
  getModerators,
  deleteModerator,
  addModerators,
  getInquiries,
  updateInquiryFlag,
  getUsers,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/moderators", getModerators);

router.delete("/moderators/:id", deleteModerator);

router.post("/add-moderator", addModerators);

router.get("/inquiries", getInquiries);

router.put("/inquiries/:id", updateInquiryFlag);

router.get("/users/search", getUsers);

router.delete("/users/:id", deleteUser);

export default router;
