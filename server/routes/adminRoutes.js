import express from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import { 
  getAllBookings, 
  getAllShows, 
  getDashboardData, 
  isAdmin 
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Must run protect FIRST → attaches req.user
// THEN protectAdmin → checks req.user.isAdmin
adminRouter.get('/is-admin', protect, protectAdmin, isAdmin);
adminRouter.get('/dashboard', protect, protectAdmin, getDashboardData);
adminRouter.get('/all-shows', protect, protectAdmin, getAllShows);
adminRouter.get('/all-bookings', protect, protectAdmin, getAllBookings);

export default adminRouter;
