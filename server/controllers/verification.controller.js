import User from "../models/User.js";

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.json({
        success: false,
        message: "Email already verified.",
      });
    }

    if (user.otp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (new Date() > user.otpExpiry) {
      return res.json({
        success: false,
        message: "OTP expired.",
      });
    }

    user.emailVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};