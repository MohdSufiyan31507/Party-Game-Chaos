import { apiRequest } from "./api";
import type { Room, RoomStatus } from "../types/room";

export function createRoomRequest(
  token: string,
  payload: { name: string; maxPlayers: number },
) {
  return apiRequest<{ room: Room }>("/rooms", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function joinRoomRequest(token: string, payload: { code: string }) {
  return apiRequest<{ room: Room }>("/rooms/join", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function leaveRoomRequest(token: string, code: string) {
  return apiRequest<{ left: true; deleted: boolean; room: Room | null }>(`/rooms/${code}/leave`, {
    method: "POST",
    token,
  });
}

export function fetchRoomRequest(token: string, code: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}`, { token });
}

export function updateRoomStatusRequest(
  token: string,
  code: string,
  status: RoomStatus,
) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export function randomizeTeamsRequest(token: string, code: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/teams/randomize`, {
    method: "POST",
    token,
  });
}

export function lockTeamsRequest(token: string, code: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/teams/lock`, {
    method: "POST",
    token,
  });
}

export function setupLocalTeamsRequest(
  token: string,
  code: string,
  payload: {
    redTeamName: string;
    blueTeamName: string;
    redMembers: string[];
    blueMembers: string[];
  },
) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/teams/local`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function selectGameRequest(token: string, code: string, gameId: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/game`, {
    method: "POST",
    token,
    body: JSON.stringify({ gameId }),
  });
}

export function selectCategoryRequest(token: string, code: string, category: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/category`, {
    method: "POST",
    token,
    body: JSON.stringify({ category }),
  });
}

export function startGameplayRequest(token: string, code: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/gameplay/start`, {
    method: "POST",
    token,
  });
}

export function submitGameplayActionRequest(
  token: string,
  code: string,
  action: "correct" | "skip",
) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/gameplay/action`, {
    method: "POST",
    token,
    body: JSON.stringify({ action }),
  });
}

export function switchGameplayTeamRequest(token: string, code: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/gameplay/switch-team`, {
    method: "POST",
    token,
  });
}

export function endRoundRequest(
  token: string,
  code: string,
  reason: "manual" | "time-up",
) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/gameplay/end-round`, {
    method: "POST",
    token,
    body: JSON.stringify({ reason }),
  });
}

export function nextRoundRequest(token: string, code: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/gameplay/next-round`, {
    method: "POST",
    token,
  });
}

export function finishGameRequest(token: string, code: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/gameplay/finish`, {
    method: "POST",
    token,
  });
}

export function resetRoomRequest(token: string, code: string) {
  return apiRequest<{ room: Room }>(`/rooms/${code}/reset`, {
    method: "POST",
    token,
  });
}
