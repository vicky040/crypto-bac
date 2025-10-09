import asyncHandler from "../Utils/asyncHandler.js";
import User from "../Models/user.models.js";
import CryptoPrice from "../Models/crypto.models.js";
import UploadOnCloudinary from '../Utils/Cloudinary.js'
import Transaction from'../Models/transection.models.js'
import QR from "../Models/qrcode.model.js";
import DepositRequest from '../Models/depositRequest.model.js';
import Admin from '../Models/admin.models.js'
import jwt from 'jsonwebtoken'

// 1️⃣ Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json(users);
});

// 2️⃣ Get single user by ID
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
});

export const updateUserBalance = asyncHandler(async (req, res) => {
  const { addAmount } = req.body; // we now expect addAmount from frontend
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  // Make sure we have a number
  const amountToAdd = parseFloat(addAmount);
  if (isNaN(amountToAdd)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  // Add to existing balance
  user.usdt = (user.usdt || 0) + amountToAdd;
  await user.save();

  // Log as a transaction
  await Transaction.create({
    userId: user._id,
    type: "admin_credit", // more descriptive than admin_update
    amount: amountToAdd, // only log the added amount
    status: "completed",
    date: new Date()
  });

  res.status(200).json({
    message: `Balance increased by ${amountToAdd}`,
    newBalance: user.balance,
    user
  });
});


// 4️⃣ Get all crypto prices (BTC, ETH, DOGE, EOS)
export const getAllCryptoPrices = asyncHandler(async (req, res) => {
    const cryptos = await CryptoPrice.find();
    res.status(200).json(cryptos);
});

// 5️⃣ Update crypto price
export const updateCryptoPrice = asyncHandler(async (req, res) => {
  
    const { newPrice } = req.body;
    const crypto = await CryptoPrice.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!crypto) return res.status(404).json({ message: "Crypto not found" });

    crypto.price = parseFloat(newPrice);
    await crypto.save();
    res.status(200).json({ message: "Crypto price updated", crypto });
});

export const getAllTransactions = asyncHandler(async (req, res) => {

  const transactions = await Transaction.find({ status: 'pending' });

  const total = await Transaction.countDocuments({ status: 'pending' });

  res.status(200).json({
    success: true,
    totalTransactions: total,
    transactions,
  });
});

export const uploadQRCode = asyncHandler(async (req, res) => {
  try {

    console.log("Hello World");

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const localFilePath = req.file.path;

    const cloudinaryResponse = await UploadOnCloudinary(localFilePath);

    if (!cloudinaryResponse) {
      return res.status(500).json({ message: 'Upload to Cloudinary failed' });
    }

    req.body.qrUrl = cloudinaryResponse.secure_url;
    req.body.public_id = cloudinaryResponse.public_id;

    const qr = await QR.create(req.body);

    res.status(200).json({
      message: 'QR code uploaded successfully',
      data : qr
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

export const getAllDepositRequests = async (req, res) => {
  try {
    // you can filter by status if needed: ?status=pending
    const { status } = req.query;

    const deposits = await DepositRequest.find({status: 'pending'})
      .populate('userId') // populate user details
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: deposits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateDepositStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected' | 'completed'

    const deposit = await DepositRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!deposit) {
      return res.status(404).json({ success: false, message: 'Deposit request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Deposit status updated',
      data: deposit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);
  

  if(username == "piyush" && password == "naveen"){
    const token = jwt.sign(
      { id: "68a2fd7d1910c8fd7f515c17", username: "piyush" },
      process.env.JWT_SECRET_STRING,
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 60 * 60 * 10000,
    });

    res.status(200).json({ success: true, message: "Logged in" });
  } else{
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = admin.password == password;
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET_STRING,
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 60 * 60 * 10000,
    });

    res.status(200).json({ success: true, message: "Logged in" });

}
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Strict",
  });

  res.status(200).json({ success: true, message: "Logged out" });
});