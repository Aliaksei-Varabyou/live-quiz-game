import { User } from "../types";

const userStore = new Map<string, User>;

export function addUser(user: User): void {
  userStore.set(user.index, user);
}

export function getUser(id: string): User | undefined {
  return userStore.get(id);
}

export function getUserByName(name: string): User | undefined {
  return Array.from(userStore.values()).find(u => u.name === name);
}
