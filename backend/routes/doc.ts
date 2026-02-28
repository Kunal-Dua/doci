import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import { DocRole } from "../generated/prisma/enums.js";
import { createDoc, deleteDoc } from "../schemas/docSchema.js";
const docRouter = express.Router();

docRouter.use(authMiddleware);

docRouter.get("/", async (req, res) => {
  const docs = await prisma.doc.findMany({});
  return res.send(docs);
});

docRouter.get("/:docId", async (req, res) => {
  console.log(req.params.docId);
  res.send("in ws");
});

docRouter.post("/create", async (req, res) => {
  const bodyParsed = createDoc.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }

  const docId = await prisma.doc.create({
    data: {
      title: bodyParsed.data.title,
      authorId: req.userid,
      role: DocRole.OWNER,
    },
    select: {
      id: true,
    },
  });

  return res.json(docId);
});

docRouter.delete("/delete", async (req, res) => {
  const bodyParsed = deleteDoc.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }

  await prisma.doc.delete({
    where: {
      id: bodyParsed.data.docId,
    },
  });
  return res.json("Deleted succesfully");
});

export { docRouter };
