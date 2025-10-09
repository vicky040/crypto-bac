import { Router } from "express";
import { getMyAccount, getHomeCryptoPrices, depositUSDT, withdrawUSDT, getLatestQRCode, createDepositRequest } from "../Controllers/user.controller.js";
import isLogined from "../Middlewares/isLogined.js";

const router = Router();

router.get("/cryptos", isLogined, getHomeCryptoPrices);
router.get("/me", isLogined, getMyAccount);
router.post("/deposit", isLogined, depositUSDT);
router.post("/withdraw", isLogined, withdrawUSDT);
router.get('/qr', getLatestQRCode);
router.post('/createDeposit', isLogined, createDepositRequest);

export default router;