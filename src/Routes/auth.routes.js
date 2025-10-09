import { Router } from "express";
import { generateOTP, verifyOTPAndCreateUser, loginUser, logoutUser } from "../Controllers/auth.controller.js";
import isLogined from "../Middlewares/isLogined.js";

const router = Router();

router.route('/requestOTP').post(generateOTP);
router.route('/addUser').post(verifyOTPAndCreateUser);
router.route('/login').post(loginUser);
router.route('/logout').post(isLogined, logoutUser);

export default router;