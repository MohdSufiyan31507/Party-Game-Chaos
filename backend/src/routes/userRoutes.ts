import { Router } from "express";
import {
  getProfile,
  getLeaderboard,
  getRecentRooms,
  getStore,
  getStats,
  purchaseStoreItem,
  updateProfile,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRoutes = Router();

userRoutes.get("/profile", requireAuth, asyncHandler(getProfile));
userRoutes.put("/profile", requireAuth, asyncHandler(updateProfile));
userRoutes.get("/stats", requireAuth, asyncHandler(getStats));
userRoutes.get("/leaderboard", requireAuth, asyncHandler(getLeaderboard));
userRoutes.get("/rooms/recent", requireAuth, asyncHandler(getRecentRooms));
userRoutes.get("/store", requireAuth, asyncHandler(getStore));
userRoutes.post("/store/purchase", requireAuth, asyncHandler(purchaseStoreItem));
