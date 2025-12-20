import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { getAllUsers, getUserByToken, updateProfilePic, updateUser,getProfilePic, getAllContact } from "../controllers/userController.js";
import { upload } from "../middleware/imageUploadHandler.js";
import { validateProfilePicUpdate } from "../middleware/userInputValidation.js";
import { getProfilePicService } from "../services/userService.js";


const router = express.Router();

router.get("/",getAllUsers)
router.get('/contact',getAllContact)
router.put('/',updateUser)
router.get('/self/token', getUserByToken);
router.put("/profile/change-profile-pic",upload.single('profilePic'),validateProfilePicUpdate,updateProfilePic)
router.get("/profile/pic/:userId",getProfilePic)

export default router;