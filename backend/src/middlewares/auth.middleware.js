import jwt from "jsonwebtoken";
import foodPartnerModel from "../models/foodpartner.js";
import userModel from "../models/user.model.js";

function getTokenFromRequest(req) {
  // Prefer cookie, fallback to Authorization header (Bearer <token>)
  const cookieToken = req.cookies?.token;
  const header = req.headers?.authorization;
  const bearerToken = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  return cookieToken || bearerToken || null;
}

export async function authFoodPartnerMiddleware(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    console.log("Auth (food partner) incoming. Cookies:", req.cookies, "AuthHeader:", req.headers.authorization ? "[present]" : "[none]");

    if (!token) {
      return res.status(401).json({ message: "Please login first (no token found)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foodPartner = await foodPartnerModel.findById(decoded.id);
    if (!foodPartner) return res.status(401).json({ message: "Invalid token (food partner not found)" });

    req.foodPartner = foodPartner;
    next();
  } catch (err) {
    console.error("authFoodPartnerMiddleware error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function authUserMiddleware(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    console.log("Auth (user) incoming. Cookies:", req.cookies, "AuthHeader:", req.headers.authorization ? "[present]" : "[none]");

    if (!token) {
      return res.status(401).json({ message: "Please login first (no token found)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token (user not found)" });

    req.user = user;
    next();
  } catch (err) {
    console.error("authUserMiddleware error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

export default { authFoodPartnerMiddleware, authUserMiddleware };
