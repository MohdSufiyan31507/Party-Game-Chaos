import { Router } from "express";
import { guestLogin, login, me, signup } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post("/signup", asyncHandler(signup));
authRoutes.post("/login", asyncHandler(login));
authRoutes.post("/guest", asyncHandler(guestLogin));
authRoutes.get("/me", requireAuth, asyncHandler(me));
