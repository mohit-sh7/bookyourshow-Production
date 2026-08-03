import express from "express";
import { registerUser, loginUser, logoutUser, profile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { googleLogin } from "../controllers/authController.js";
import { verifyOTP } from "../controllers/verification.controller.js";



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.get("/profile", protect, profile);
router.post("/google", googleLogin);
router.post("/verify-otp", verifyOTP);

export default router;
