import asyncHandler from '../Utils/asyncHandler.js'
import CryptoPrice from "../Models/crypto.models.js";
import User from "../Models/user.models.js";
import QR from "../Models/qrcode.model.js"
import DepositRequest from '../Models/depositRequest.model.js';

export const getUserData = asyncHandler(async (req, res) => {
  // req.user is already populated by protect middleware
  res.status(200).json({
    message: "User data fetched successfully",
    user: req.user,
  });
});

// @desc Get crypto prices for Home
// @route GET /api/v1/home/cryptos
// @access Public
export const getHomeCryptoPrices = asyncHandler(async (req, res) => {

  console.log("Hello");
  

  const cryptos = await CryptoPrice.find();

  // Transform for frontend:
  const data = cryptos.map(c => ({
    symbol: `${c.symbol}/USDT`,
    name: c.symbol === "BTC" ? "Bitcoin" :
          c.symbol === "ETH" ? "Ethereum" :
          c.symbol === "DOGE" ? "Dogecoin" :
          c.symbol === "EOS" ? "EOS" : c.symbol,
    price: c.price,
    change: `${c.change}%`,
    volume: c.volume,
    isNegative: c.change < 0,
    icon: c.symbol === "BTC" ? "₿" :
          c.symbol === "ETH" ? "Ξ" :
          c.symbol === "DOGE" ? "Ð" :
          c.symbol === "EOS" ? "E" : "?",
    color: c.symbol === "BTC" ? "#f7931a" :
           c.symbol === "ETH" ? "#627eea" :
           c.symbol === "DOGE" ? "#c2a633" :
           c.symbol === "EOS" ? "#000000" : "#999"
  }));

  res.status(200).json(data);
});

/**
 * @desc Get user account details
 * @route GET /api/account/me
 * @access Private (requires authentication)
 */
export const getMyAccount = asyncHandler(async (req, res) => {
  // user id from token (auth middleware sets req.user)
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    username: user.username,
    email: user.email,
    mobile: user.mobile,
    usdt: user.usdt,
    deposit: user.deposit,
    withdrawal: user.withdrawal,
    currentPlan: user.currentPlan,
  });
});

/**
 * @desc Deposit USDT
 * @route POST /api/account/deposit
 * @access Private
 */
export const depositUSDT = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Invalid deposit amount" });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.deposit += amount;
  user.usdt += amount;
  await user.save();

  res.json({
    message: "Deposit successful",
    usdt: user.usdt,
    deposit: user.deposit,
  });
});

/**
 * @desc Withdraw USDT
 * @route POST /api/account/withdraw
 * @access Private
 */
export const withdrawUSDT = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Invalid withdrawal amount" });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.usdt < amount)
    return res.status(400).json({ message: "Insufficient funds" });

  user.usdt -= amount;
  user.withdrawal += amount;
  await user.save();

  res.json({
    message: "Withdrawal successful",
    usdt: user.usdt,
    withdrawal: user.withdrawal,
  });
});

export const getLatestQRCode = asyncHandler(async (req, res) => {
  try {
    // Find the latest QR by upload date
    const latestQR = await QR.findOne().sort({ uploadedAt: -1 });

    if (!latestQR) {
      return res.status(404).json({ message: "No QR code found" });
    }

    res.status(200).json({
      message: "Latest QR code fetched successfully",
      data: latestQR.qrUrl
    });
  } catch (err) {
    console.error("Error fetching QR code:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export const createDepositRequest = async (req, res) => {
  try {
    const { selectedAmount } = req.body;
    const userId = req.user._id; // assuming you have auth middleware

    if (!selectedAmount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const depositRequest = new DepositRequest({
      userId,
      amount: selectedAmount,
      status: 'pending', // default status
    });

    await depositRequest.save();

    res.status(201).json({
      success: true,
      message: 'Deposit request created successfully',
      data: depositRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};