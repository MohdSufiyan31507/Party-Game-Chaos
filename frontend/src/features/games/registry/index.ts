import { gameMetadata } from "../metadata/gameMetadata";

export const gameRegistry = gameMetadata;

export function getGameById(id: string) {
  return gameRegistry.find((game) => game.id === id);
}

export function getPlayableGames() {
  return gameRegistry.filter((game) => game.status === "MVP");
}
