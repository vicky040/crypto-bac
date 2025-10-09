import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // Reference to the user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // name of your user model
    required: true,
  },

  // Transaction details
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ['USD', 'INR', 'BTC', 'ETH', 'DOGE', 'EOS', 'USDT'],
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'], // money in / money out
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  description: {
    type: String,
    trim: true,
  },

  // Additional meta
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['bank', 'card', 'crypto', 'wallet'],
    default: 'wallet',
  },

  // Timestamps for auditing
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);