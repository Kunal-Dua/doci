import z from "zod";
import { DocRole } from "../generated/prisma/enums.js";

const updateDoc = z.object({
  title: z.string().min(1).optional(),
  role: DocRole,
});

const getDoc = z.object({
  docId: z.string(),
});

const deleteDoc = z.object({
  docId: z.string(),
});

export { updateDoc, getDoc, deleteDoc };
