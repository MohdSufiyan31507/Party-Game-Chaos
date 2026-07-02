const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createRoomCode(length = 6) {
  let code = "";

  for (let index = 0; index < length; index += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  return code;
}
