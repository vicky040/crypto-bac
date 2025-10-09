import mongoose from "mongoose";

const qrSchema = new mongoose.Schema({
  qrUrl: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const QR = mongoose.model("QR", qrSchema);
export default QR;
