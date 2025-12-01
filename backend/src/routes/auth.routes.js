import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

/// user auth APIs
router.post("/user/register", authController.registerUser); //Register API on controllers folder
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);

/// food partner auth APIs
router.post("/foodpartner/register", authController.registerFoodPartner);
router.post("/foodpartner/login", authController.loginFoodPartner);
router.get("/foodpartner/logout", authController.logoutFoodPartner);

export default router;
