// app.js (replace previous cors setup)
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// ... other imports

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://reelers-9.onrender.com' // add production origin when ready
];

const corsOptions = {
  origin: function(origin, callback) {
    // allow non-origin requests (curl, mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // explicit preflight handling

app.use(express.json());
app.use(cookieParser());

// routes...
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

export default app;
