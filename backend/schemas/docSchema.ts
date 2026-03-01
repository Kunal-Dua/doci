import z from "zod";
import { DocRole } from "../generated/prisma/enums.js";

const updateDoc = z.object({
  title: z.string().min(1).optional(),
  role: DocRole,
});

const deleteDoc = z.object({
  docId: z.string(),
});

export { updateDoc, deleteDoc };
