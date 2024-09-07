const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");


router.get('/moderators',adminController.getModerators);

router.delete('/moderators/:id',adminController.deleteModerator);

router.post("/add-moderator", adminController.addModerators);

module.exports = router;