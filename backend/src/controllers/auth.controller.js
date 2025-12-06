import userModel from "../models/user.model.js";
import foodPartnerModel from "../models/foodpartner.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// COMMON COOKIE CONFIG
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",  // needed for HTTPS
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // allow cross-site cookies
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
};

// 🔹 REGISTER USER
async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}

// 🔹 LOGIN USER
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}

// 🔹 LOGOUT USER
function logoutUser(req, res) {
  res.clearCookie("token", {
    ...cookieOptions,
    expires: new Date(0),
  });

  return res.status(200).json({ message: "User logged out successfully" });
}

// 🔹 REGISTER FOOD PARTNER
async function registerFoodPartner(req, res) {
  try {
    const { businessName, contactName, phone, email, password } = req.body;

    if (!businessName || !contactName || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingPartner = await foodPartnerModel.findOne({ email });

    if (existingPartner) {
      return res
        .status(400)
        .json({ message: "Food partner account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      businessName,
      contactName,
      phone,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner,
    });
  } catch (err) {
    console.error("Food Partner Register Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 🔹 LOGIN FOOD PARTNER
async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Food partner logged in successfully",
      foodPartner,
    });
  } catch (error) {
    console.error("Food Partner Login Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}

// 🔹 LOGOUT FOOD PARTNER
function logoutFoodPartner(req, res) {
  res.clearCookie("token", {
    ...cookieOptions,
    expires: new Date(0),
  });

  return res.status(200).json({
    message: "Food partner logged out successfully",
  });
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
