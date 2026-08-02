import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: {
          path: "movie",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Temporarily disable favorites
export const updateFavorite = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Favorites are temporarily disabled.",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    res.json({
      success: true,
      movies: [],
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};