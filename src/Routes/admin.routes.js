import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserBalance,
  getAllCryptoPrices,
  updateCryptoPrice, 
  getAllTransactions,
  uploadQRCode,
  getAllDepositRequests,
  updateDepositStatus,
  loginAdmin
} from "../Controllers/admin.controller.js";
import upload from "../Middlewares/multer.middleware.js";
import protectAdmin from '../Middlewares/isAdmin.js';

const router = express.Router();

/**
 * USER ROUTES
 */
// Get all users
router.get("/users", protectAdmin, getAllUsers);

// Get single user by ID
router.get("/users/:id", protectAdmin, getUserById);

// Update user balance (USDT)
router.put("/users/:id/balance", protectAdmin, updateUserBalance);

/**
 * CRYPTO ROUTES
 */
// Get all crypto prices
router.get("/crypto", protectAdmin, getAllCryptoPrices);

router.put("/crypto/:symbol", protectAdmin, updateCryptoPrice);

router.get("/transactions", protectAdmin, getAllTransactions);

router.post('/uploadqr', protectAdmin, upload.single('qr'), uploadQRCode);

router.get('/depositReq', protectAdmin, getAllDepositRequests);

router.put('/deposits/:id', protectAdmin, updateDepositStatus);

router.post("/login", loginAdmin);        

export default router;