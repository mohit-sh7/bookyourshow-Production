import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";

// ✔️ Proper admin check (reads from req.user injected by JWT middleware)
export const isAdmin = async (req, res) => {
    try {
        return res.json({
            success: true,
            isAdmin: req.user.isAdmin === true
        });
    } catch (err) {
        return res.json({ success: false, message: "Error checking admin" });
    }
};

// ✔️ Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find({
            showDateTime: { $gte: new Date() }
        }).populate("movie");

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, b) => acc + b.amount, 0),
            activeShows,
            totalUser,
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// ✔️ All Shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({
            showDateTime: { $gte: new Date() }
        })
            .populate("movie")
            .sort({ showDateTime: 1 });

        res.json({ success: true, shows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// ✔️ All Bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate("user")
            .populate({
                path: "show",
                populate: { path: "movie" },
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
