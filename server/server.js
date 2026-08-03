import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./configs/db.js";

import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";

import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

const app = express();
const port = process.env.PORT || 3000;

// Database connection
await connectDB();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Stripe webhook (must come before express.json())
app.use(
 "/api/stripe",
  express.raw({ type: "application/json" }),
 stripeWebhooks
);

// Normal middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://bookyourshow-production.vercel.app",
  "https://bookyourshow-production-i516am9gk-mohit-sh7s-projects.vercel.app",
];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Server is live!");
});

 app.use("/api/auth", authRouter);
 app.use("/api/show", showRouter);
 app.use("/api/booking", bookingRouter);
 app.use("/api/admin", adminRouter);
 app.use("/api/user", userRouter);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION");
  console.error(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

