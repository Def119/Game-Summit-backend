const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");


server.get('/moderators',adminController.getModerators);

server.delete('/moderators/:id',adminController.deleteModerator);

router.post("/add-moderator", adminController.addModerators);
