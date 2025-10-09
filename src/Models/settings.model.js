import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  telegramLink: {
    type: String,
    default: "",
  },
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);