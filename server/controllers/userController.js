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

import User from "../models/User.js";

export const updateFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }

    const exists = user.favorites.includes(movieId);

    if (exists) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== movieId
      );

      await user.save();

      return res.json({
        success: true,
        message: "Removed from favorites.",
      });
    }

    user.favorites.push(movieId);

    await user.save();

    return res.json({
      success: true,
      message: "Added to favorites.",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const movies = await Movie.find({
      _id: { $in: user.favorites },
    });

    return res.json({
      success: true,
      movies,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};