import type { Server as HttpServer } from "node:http";
import { Server, type Socket } from "socket.io";
import { isAllowedCorsOrigin } from "../config/cors.js";
import { UserModel } from "../models/User.js";
import { verifyAuthToken } from "../utils/jwt.js";

type AuthedSocket = Socket & {
  userId?: string;
};

let io: Server | null = null;

export function initSocketServer(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        callback(null, isAllowedCorsOrigin(origin));
      },
      credentials: true,
    },
  });

  io.use(async (socket: AuthedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (typeof token !== "string") {
        throw new Error("Missing socket token");
      }

      const payload = verifyAuthToken(token);
      const user = await UserModel.findById(payload.userId);

      if (!user) {
        throw new Error("Socket user not found");
      }

      socket.userId = user.id;
      next();
    } catch {
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket: AuthedSocket) => {
    socket.on("room:join", (code: unknown) => {
      if (typeof code !== "string") return;
      socket.join(roomChannel(code));
    });

    socket.on("room:leave", (code: unknown) => {
      if (typeof code !== "string") return;
      socket.leave(roomChannel(code));
    });
  });

  return io;
}

export function emitRoomUpdated(code: string) {
  io?.to(roomChannel(code)).emit("room:updated", { code });
}

function roomChannel(code: string) {
  return `room:${code.toUpperCase()}`;
}
