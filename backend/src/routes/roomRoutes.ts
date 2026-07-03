import { Router } from "express";
import {
  createRoom,
  endRound,
  finishGame,
  getRoom,
  joinRoom,
  leaveRoom,
  lockTeams,
  randomizeTeams,
  resetRoom,
  selectCategory,
  selectGame,
  setupLocalTeams,
  nextRound,
  startGameplay,
  submitGameplayAction,
  switchGameplayTeam,
  updateRoomStatus,
} from "../controllers/roomController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const roomRoutes = Router();

roomRoutes.use(requireAuth);
roomRoutes.post("/", asyncHandler(createRoom));
roomRoutes.post("/join", asyncHandler(joinRoom));
roomRoutes.get("/:code", asyncHandler(getRoom));
roomRoutes.post("/:code/leave", asyncHandler(leaveRoom));
roomRoutes.patch("/:code/status", asyncHandler(updateRoomStatus));
roomRoutes.post("/:code/teams/randomize", asyncHandler(randomizeTeams));
roomRoutes.post("/:code/teams/lock", asyncHandler(lockTeams));
roomRoutes.post("/:code/teams/local", asyncHandler(setupLocalTeams));
roomRoutes.post("/:code/game", asyncHandler(selectGame));
roomRoutes.post("/:code/category", asyncHandler(selectCategory));
roomRoutes.post("/:code/gameplay/start", asyncHandler(startGameplay));
roomRoutes.post("/:code/gameplay/action", asyncHandler(submitGameplayAction));
roomRoutes.post("/:code/gameplay/switch-team", asyncHandler(switchGameplayTeam));
roomRoutes.post("/:code/gameplay/end-round", asyncHandler(endRound));
roomRoutes.post("/:code/gameplay/next-round", asyncHandler(nextRound));
roomRoutes.post("/:code/gameplay/finish", asyncHandler(finishGame));
roomRoutes.post("/:code/reset", asyncHandler(resetRoom));
