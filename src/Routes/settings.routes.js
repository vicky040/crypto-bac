import express from "express";
import { getTelegramLink, updateTelegramLink } from "../Controllers/settings.controller.js";
import verifyAdmin from "../Middlewares/isAdmin.js";

const router = express.Router();

router.get("/telegram", getTelegramLink); // Public (for showing on user side)
router.put("/telegram", verifyAdmin, updateTelegramLink); // Admin only

export default router;