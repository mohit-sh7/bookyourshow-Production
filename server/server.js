import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';
import cookieParser from "cookie-parser";



const app = express();
const port = 3000;

await connectDB();

app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// NORMAL JSON MIDDLEWARE
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173" || process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// ROUTES
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/auth', authRouter);
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
