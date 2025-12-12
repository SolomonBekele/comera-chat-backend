import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { getAllUsers, getUserByToken, updateProfilePic, updateUser,getProfilePic } from "../controllers/userController.js";
import { upload } from "../middleware/imageUploadHandler.js";
import { validateProfilePicUpdate } from "../middleware/userInputValidation.js";
import { getProfilePicService } from "../services/userService.js";


const router = express.Router();

router.get("/",getAllUsers)
router.put('/',updateUser)
router.get('/self/token', getUserByToken);
router.put("/profile/change-profile-pic",upload.single('profilePic'),validateProfilePicUpdate,updateProfilePic)
router.get("/profile/pic",getProfilePic)

export default router;