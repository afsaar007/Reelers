import express from 'express'
import foodPartnerController from "../controllers/food-Partner.controller.js"
import authMiddleware from '../middlewares/auth.middleware.js';



const router = express.Router();
/* GET /api/food-partner/:id [protected] */
router.get("/:id",
   authMiddleware.authUserMiddleware,
   foodPartnerController.getFoodPartnerById)

export default router;