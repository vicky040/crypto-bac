import mongoose from "mongoose";

const cryptoSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  volume: { type: String }
});

export default mongoose.model("CryptoPrice", cryptoSchema);