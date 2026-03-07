import { atom } from "recoil";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}

export const userAtom = atom({
  key: "userAtom",
  default: {} as User,
});
