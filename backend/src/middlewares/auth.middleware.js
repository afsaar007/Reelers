// src/middlewares/auth.middleware.js
import foodPartnerModel from "../models/foodpartner.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

function getTokenFromRequest(req) {
  const cookieToken = req.cookies?.token;
  const header = req.headers?.authorization;
  const bearerToken = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  return cookieToken || bearerToken || null;
}

export async function authFoodPartnerMiddleware(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    console.log("authFoodPartnerMiddleware incoming -> cookies:", req.cookies, "authHeaderPresent:", !!req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "Please login first (no token found)" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("FoodPartner token verify error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    const foodPartner = await foodPartnerModel.findById(decoded.id);
    if (!foodPartner) {
      return res.status(401).json({ message: "Invalid token (food partner not found)" });
    }

    req.foodPartner = foodPartner;
    next();
  } catch (err) {
    console.error("authFoodPartnerMiddleware error:", err);
    return res.status(500).json({ message: "Server error in auth middleware" });
  }
}

export async function authUserMiddleware(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    console.log("authUserMiddleware incoming -> cookies:", req.cookies, "authHeaderPresent:", !!req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "Please login first (no token found)" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("User token verify error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token (user not found)" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("authUserMiddleware error:", err);
    return res.status(500).json({ message: "Server error in auth middleware" });
  }
}

export default {
  authFoodPartnerMiddleware,
  authUserMiddleware,
  getTokenFromRequest,
};
