import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^[0-9]{10,15}$/, "Enter a valid mobile number"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  usdt: {
    type: Number,
    default: 0,
  },
  deposit: {
    type: Number,
    default: 0,
  },
  withdrawal: {
    type: Number,
    default: 0,
  },

  currentPlan: {
    type: String,
    enum: ["basic", "silver", "gold", "platinum"],
    default: "basic",
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


userSchema.methods.correctPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;