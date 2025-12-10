import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { getAllUsers, getUserByToken, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/",protectRoute,getAllUsers)
router.put('/',protectRoute,updateUser)
router.get('/self/token', protectRoute, getUserByToken);

export default router;