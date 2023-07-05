import express from "express"
import { getMyInfo, loginUser, logoutUser, registerUser } from "../controller/user.js";

const router = express.Router();


router.get("/me" , getMyInfo)


router.post("/register" , registerUser)


router.post("/login" , loginUser)


router.get("/logout" , logoutUser)

export default router;