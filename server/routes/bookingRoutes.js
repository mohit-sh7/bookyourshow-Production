import express from "express";

import {
    createBooking,
    getOccupiedSeats,
    retryPayment,
    verifyTicket,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, createBooking);
router.get("/seats/:showId", getOccupiedSeats);
router.post("/retry-payment/:bookingId", protect, retryPayment);
router.get("/verify/:bookingId", verifyTicket);

export default router;