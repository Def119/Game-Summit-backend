import express from 'express';
const router = express.Router();
import router from '../authentication/userAuth';
import adminController from '../controllers/adminController';


router.get('/moderators',adminController.getModerators);

router.delete('/moderators/:id',adminController.deleteModerator);

router.post("/add-moderator", adminController.addModerators);

router.get("/inquiries", adminController.getInquiries);

router.put("/inquiries/:id", adminController.updateInquiryFlag);

router.get('/users/search', adminController.getUsers);


router.delete('/users/:id', adminController.deleteUser);

module.exports = router;