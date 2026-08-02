import express from "express";
import { registerUser, loginUser, logoutUser, profile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { googleLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.get("/profile", protect, profile);
router.post("/google", googleLogin);

export default router;
