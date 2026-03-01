import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import { DocRole } from "../generated/prisma/enums.js";
import { updateDoc, deleteDoc } from "../schemas/docSchema.js";
const docRouter = express.Router();

docRouter.get("/:docId", async (req, res) => {
  console.log(req.params.docId);
  res.send("in ws");
});

docRouter.use(authMiddleware);

docRouter.get("/", async (req, res) => {
  const docs = await prisma.doc.findMany({});
  return res.send(docs);
});

docRouter.post("/create", async (req, res) => {
  const docId = await prisma.doc.create({
    data: {
      title: "",
      authorId: req.userid,
      role: DocRole.OWNER,
    },
    select: {
      id: true,
    },
  });

  return res.json(docId);
});

docRouter.put("/update", async (req, res) => {
  const bodyParsed = updateDoc.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }

  const docId = await prisma.doc.updateMany({
    where: {
      authorId: req.userid,
    },
    data: {
      title: bodyParsed.data.title!,
      role: bodyParsed.data.role as DocRole,
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
