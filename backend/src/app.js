// src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import foodRoutes from "./routes/food.routes.js";
import foodPartnerRoutes from "./routes/food-partner.routes.js";
import cors from "cors";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

// optional 404 fallback — keep commented while testing or enable when ready
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
