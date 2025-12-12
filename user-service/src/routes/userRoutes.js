import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { getAllUsers, getUserByToken, updateProfilePic, updateUser } from "../controllers/userController.js";
import { upload } from "../middleware/imageUploadHandler.js";
import { validateProfilePicUpdate } from "../middleware/userInputValidation.js";

const router = express.Router();

router.get("/",getAllUsers)
router.put('/',updateUser)
router.get('/self/token', getUserByToken);
router.post("/profile/change-profile-pic",upload.single('profilePic'),validateProfilePicUpdate,updateProfilePic)

export default router;