import { atom } from "recoil";

interface Doc {
  id: string;
  title: string;
}

export const docAtom = atom({
  key: "DocAtom",
  default: {} as Doc,
});
