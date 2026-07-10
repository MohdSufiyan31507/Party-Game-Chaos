import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createRoomRequest,
  changeGameRequest,
  endRoundRequest,
  fetchRoomRequest,
  finishGameRequest,
  joinRoomRequest,
  leaveRoomRequest,
  lockTeamsRequest,
  randomizeTeamsRequest,
  selectCategoryRequest,
  selectGameRequest,
  setupLocalTeamsRequest,
  startGameplayRequest,
  submitGameplayActionRequest,
  switchGameplayTeamRequest,
  nextRoundRequest,
  updateRoomStatusRequest,
  resetRoomRequest,
} from "../services/roomService";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socketClient";
import type { Room, RoomStatus } from "../types/room";
import { useAuth } from "./AuthContext";

const ACTIVE_ROOM_KEY = "chaos-ka-adda-active-room";

type RoomContextValue = {
  activeRoom: Room | null;
  isRoomLoading: boolean;
  socketState: "offline" | "connecting" | "online";
  createRoom: (payload: { name: string; maxPlayers: number }) => Promise<Room>;
  joinRoom: (payload: { code: string }) => Promise<Room>;
  leaveRoom: (code: string) => Promise<Room | null>;
  loadRoom: (code: string) => Promise<Room>;
  updateRoomStatus: (code: string, status: RoomStatus) => Promise<Room>;
  randomizeTeams: (code: string) => Promise<Room>;
  lockTeams: (code: string) => Promise<Room>;
  setupLocalTeams: (
    code: string,
    payload: {
      redTeamName: string;
      blueTeamName: string;
      redMembers: string[];
      blueMembers: string[];
    },
  ) => Promise<Room>;
  selectGame: (code: string, gameId: string) => Promise<Room>;
  selectCategory: (code: string, category: string) => Promise<Room>;
  startGameplay: (code: string) => Promise<Room>;
  submitGameplayAction: (code: string, action: "correct" | "skip") => Promise<Room>;
  switchGameplayTeam: (code: string) => Promise<Room>;
  endRound: (code: string, reason: "manual" | "time-up") => Promise<Room>;
  nextRound: (code: string) => Promise<Room>;
  finishGame: (code: string) => Promise<Room>;
  changeGame: (code: string) => Promise<Room>;
  resetRoom: (code: string) => Promise<Room>;
  clearRoom: () => void;
};

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isRoomLoading, setIsRoomLoading] = useState(false);
  const [socketState, setSocketState] = useState<"offline" | "connecting" | "online">("offline");

  const requireToken = useCallback(() => {
    if (!token) {
      throw new Error("You need to login before using rooms");
    }

    return token;
  }, [token]);

  const rememberRoom = useCallback((room: Room) => {
    localStorage.setItem(ACTIVE_ROOM_KEY, room.code);
    setActiveRoom(room);
  }, []);

  const forgetRoom = useCallback(() => {
    localStorage.removeItem(ACTIVE_ROOM_KEY);
    setActiveRoom(null);
  }, []);

  const createRoom = useCallback(
    async (payload: { name: string; maxPlayers: number }) => {
      setIsRoomLoading(true);
      try {
        const response = await createRoomRequest(requireToken(), payload);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const joinRoom = useCallback(
    async (payload: { code: string }) => {
      setIsRoomLoading(true);
      try {
        const response = await joinRoomRequest(requireToken(), payload);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const loadRoom = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await fetchRoomRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const leaveRoom = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await leaveRoomRequest(requireToken(), code);

        if (response.room) {
          rememberRoom(response.room);
        } else {
          forgetRoom();
        }

        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [forgetRoom, rememberRoom, requireToken],
  );

  const updateRoomStatus = useCallback(
    async (code: string, status: RoomStatus) => {
      setIsRoomLoading(true);
      try {
        const response = await updateRoomStatusRequest(requireToken(), code, status);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const randomizeTeams = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await randomizeTeamsRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const lockTeams = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await lockTeamsRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const setupLocalTeams = useCallback(
    async (
      code: string,
      payload: {
        redTeamName: string;
        blueTeamName: string;
        redMembers: string[];
        blueMembers: string[];
      },
    ) => {
      setIsRoomLoading(true);
      try {
        const response = await setupLocalTeamsRequest(requireToken(), code, payload);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const selectGame = useCallback(
    async (code: string, gameId: string) => {
      setIsRoomLoading(true);
      try {
        const response = await selectGameRequest(requireToken(), code, gameId);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const selectCategory = useCallback(
    async (code: string, category: string) => {
      setIsRoomLoading(true);
      try {
        const response = await selectCategoryRequest(requireToken(), code, category);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const startGameplay = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await startGameplayRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const submitGameplayAction = useCallback(
    async (code: string, action: "correct" | "skip") => {
      setIsRoomLoading(true);
      try {
        const response = await submitGameplayActionRequest(requireToken(), code, action);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const switchGameplayTeam = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await switchGameplayTeamRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const endRound = useCallback(
    async (code: string, reason: "manual" | "time-up") => {
      setIsRoomLoading(true);
      try {
        const response = await endRoundRequest(requireToken(), code, reason);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const nextRound = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await nextRoundRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const finishGame = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await finishGameRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const resetRoom = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await resetRoomRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [requireToken],
  );

  const changeGame = useCallback(
    async (code: string) => {
      setIsRoomLoading(true);
      try {
        const response = await changeGameRequest(requireToken(), code);
        rememberRoom(response.room);
        return response.room;
      } finally {
        setIsRoomLoading(false);
      }
    },
    [rememberRoom, requireToken],
  );

  const value = useMemo<RoomContextValue>(
    () => ({
      activeRoom,
      isRoomLoading,
      socketState,
      createRoom,
      joinRoom,
      leaveRoom,
      loadRoom,
      updateRoomStatus,
      randomizeTeams,
      lockTeams,
      setupLocalTeams,
      selectGame,
      selectCategory,
      startGameplay,
      submitGameplayAction,
      switchGameplayTeam,
      endRound,
      nextRound,
      finishGame,
      changeGame,
      resetRoom,
      clearRoom: () => {
        forgetRoom();
      },
    }),
    [
      activeRoom,
      changeGame,
      createRoom,
      endRound,
      finishGame,
      forgetRoom,
      isRoomLoading,
      joinRoom,
      leaveRoom,
      loadRoom,
      lockTeams,
      nextRound,
      randomizeTeams,
      resetRoom,
      selectCategory,
      selectGame,
      setupLocalTeams,
      socketState,
      startGameplay,
      submitGameplayAction,
      switchGameplayTeam,
      updateRoomStatus,
    ],
  );

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      forgetRoom();
      setSocketState("offline");
      return;
    }

    const socket = connectSocket(token);
    setSocketState(socket.connected ? "online" : "connecting");

    function handleConnect() {
      setSocketState("online");
    }

    function handleDisconnect() {
      setSocketState("offline");
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [forgetRoom, token]);

  useEffect(() => {
    if (!token || activeRoom) return;

    const savedCode = localStorage.getItem(ACTIVE_ROOM_KEY);
    if (!savedCode) return;

    loadRoom(savedCode).catch(() => {
      localStorage.removeItem(ACTIVE_ROOM_KEY);
    });
  }, [activeRoom, loadRoom, token]);

  useEffect(() => {
    if (!activeRoom) return;

    const socket = getSocket();
    const code = activeRoom.code;

    socket?.emit("room:join", code);

    function handleRoomUpdated(payload: { code?: string }) {
      if (payload.code?.toUpperCase() !== code) return;
      void loadRoom(code);
    }

    socket?.on("room:updated", handleRoomUpdated);

    return () => {
      socket?.emit("room:leave", code);
      socket?.off("room:updated", handleRoomUpdated);
    };
  }, [activeRoom?.code, loadRoom]);

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoom must be used inside RoomProvider");
  }

  return context;
}
