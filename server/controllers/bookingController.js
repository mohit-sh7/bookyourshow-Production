import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Stripe from "stripe";

// Function to check availability of selected seats
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);

        if (!showData) {
            return false;
        }

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(
            (seat) => occupiedSeats[seat]
        );

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
};

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;

        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        // Check seat availability
        const isAvailable = await checkSeatsAvailability(
            showId,
            selectedSeats
        );

        if (!isAvailable) {
            return res.json({
                success: false,
                message: "Selected seats are not available.",
            });
        }

        // Get show details
        const showData = await Show.findById(showId).populate("movie");

        if (!showData) {
            return res.json({
                success: false,
                message: "Show not found.",
            });
        }

        // Create booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        });

        // Mark seats as occupied
        selectedSeats.forEach((seat) => {
            showData.occupiedSeats[seat] = userId;
        });

        showData.markModified("occupiedSeats");

        await showData.save();

        // Initialize Stripe
        const stripeInstance = new Stripe(
            process.env.STRIPE_SECRET_KEY
        );

        // Create line items
        const lineItems = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: showData.movie.title,
                    },
                    unit_amount: Math.floor(booking.amount * 100),
                },
                quantity: 1,
            },
        ];

        // Create Stripe session
        const session =
            await stripeInstance.checkout.sessions.create({
                success_url: `${origin}/my-bookings`,
                cancel_url: `${origin}/my-bookings`,
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                metadata: {
                    bookingId: booking._id.toString(),
                },
                expires_at:
                    Math.floor(Date.now() / 1000) + 30 * 60,
            });

        booking.paymentLink = session.url;

        await booking.save();

        // Trigger Inngest event
        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString(),
            },
        });

        return res.json({
            success: true,
            url: session.url,
        });
    } catch (error) {
        console.log(error.message);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;

        const showData = await Show.findById(showId);

        if (!showData) {
            return res.json({
                success: false,
                message: "Show not found.",
            });
        }

        const occupiedSeats = Object.keys(
            showData.occupiedSeats || {}
        );

        return res.json({
            success: true,
            occupiedSeats,
        });
    } catch (error) {
        console.log(error.message);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const retryPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId).populate({
            path: "show",
            populate: {
                path: "movie",
            },
        });

        if (!booking) {
            return res.json({
                success: false,
                message: "Booking not found.",
            });
        }

        if (booking.isPaid) {
            return res.json({
                success: false,
                message: "Booking already paid.",
            });
        }

        const stripeInstance = new Stripe(
            process.env.STRIPE_SECRET_KEY
        );

        const lineItems = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: booking.show.movie.title,
                    },
                    unit_amount: booking.amount * 100,
                },
                quantity: 1,
            },
        ];

        const session =
            await stripeInstance.checkout.sessions.create({
                success_url: `${req.headers.origin}/my-bookings`,
                cancel_url: `${req.headers.origin}/my-bookings`,
                mode: "payment",
                line_items: lineItems,
                metadata: {
                    bookingId: booking._id.toString(),
                },
            });

        booking.paymentLink = session.url;

        await booking.save();

        res.json({
            success: true,
            url: session.url,
        });
    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyTicket = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({
                success: false,
                message: "Invalid ticket",
            });
        }

        if (booking.isUsed) {
            return res.json({
                success: false,
                message: "Ticket already used",
            });
        }

        booking.isUsed = true;

        await booking.save();

        res.json({
            success: true,
            message: "Entry allowed",
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};