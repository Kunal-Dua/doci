import z from "zod";

const createDoc = z.object({
  title: z.string().min(1),
});

const deleteDoc = z.object({
  docId: z.string(),
});

export { createDoc, deleteDoc };
