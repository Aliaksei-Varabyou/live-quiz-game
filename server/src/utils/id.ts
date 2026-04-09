import { randomInt, randomUUID } from "node:crypto"

export const generateId = (): string => {
  return randomUUID();
}

export const generateGameCode = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => 
    characters[randomInt(0, characters.length)]
  ).join('');
};
