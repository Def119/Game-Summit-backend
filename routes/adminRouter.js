const express = require("express");
const router = express.Router();
const auth = require('../authentication/userAuth')
const adminController = require("../controllers/adminController");


router.get('/moderators',adminController.getModerators);

router.delete('/moderators/:id',adminController.deleteModerator);

router.post("/add-moderator", adminController.addModerators);

router.get("/inquiries", adminController.getInquiries);

router.put("/inquiries/:id", adminController.updateInquiryFlag);

router.get('/users/search', adminController.getUsers);


router.delete('/users/:id', adminController.deleteUser);

module.exports = router;