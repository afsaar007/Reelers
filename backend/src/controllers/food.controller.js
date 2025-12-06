import foodModel from "../models/food.model.js";
import storageService from "../services/storage.service.js";
import likeModel from "../models/likes.model.js";
import saveModel from "../models/save.model.js";
import { v4 as uuid } from "uuid";

// =========================
// CREATE FOOD
// =========================
async function createFood(req, res) {
  try {
    if (!req.foodPartner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Food video/file is required" });
    }

    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description required" });
    }

    const extension = req.file.mimetype.split("/")[1];
    const fileName = uuid() + "." + extension;

    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer,
      fileName
    );

    const foodItem = await foodModel.create({
      name,
      description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
      message: "Food created successfully",
      food: foodItem,
    });
  } catch (err) {
    console.error("Create Food Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// =========================
// GET ALL FOOD ITEMS
// =========================
async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({});
    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems,
    });
  } catch (err) {
    console.error("Get Food Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// =========================
// LIKE FOOD
// =========================
async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        user: user._id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });

      return res.status(200).json({ message: "Food unliked successfully" });
    }

    await likeModel.create({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: 1 },
    });

    res.status(201).json({ message: "Food liked successfully" });
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// =========================
// SAVE FOOD
// =========================
async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({
        user: user._id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: -1 },
      });

      return res.status(200).json({ message: "Food unsaved successfully" });
    }

    await saveModel.create({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { savesCount: 1 },
    });

    res.status(201).json({ message: "Food saved successfully" });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// =========================
// GET SAVED FOOD
// =========================
async function getSaveFood(req, res) {
  try {
    const user = req.user;

    const savedFoods = await saveModel
      .find({ user: user._id })
      .populate("food");

    if (!savedFoods || savedFoods.length === 0) {
      return res.status(200).json({
        message: "No saved foods found",
        savedFoods: [],
      });
    }

    res.status(200).json({
      message: "Saved foods retrieved successfully",
      savedFoods,
    });
  } catch (err) {
    console.error("Get Saved Food Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
