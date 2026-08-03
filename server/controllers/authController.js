import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { adminAuth } from "../configs/firebaseAdmin.js";

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({
        success: false,
        message: "Email already used",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
    });

    return res.json({
      success: true,
      message: "Registered successfully",
    });
  } catch (err) {
    console.error(err);

    return res.json({
      success: false,
      message: err.message,
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);

    return res.json({
      success: false,
      message: err.message,
    });
  }
};

// Google login
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    console.log("Google token received");

    const decoded = await adminAuth.verifyIdToken(token);

    const email = decoded.email;
    const name = decoded.name;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Profile
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};