import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import { DocRole } from "../generated/prisma/enums.js";
import { updateDoc, deleteDoc, getDoc, collabDoc } from "../schemas/docSchema.js";
const docRouter = express.Router();

docRouter.get("/d/:docId", async (req, res) => {
  res.json("in ws");
});

docRouter.use(authMiddleware);

docRouter.get("/alldoc", async (req, res) => {
  const docs = await prisma.doc.findMany({
    where: {
      OR: [
        { authorId: req.userid },
        {
          collaborators: {
            some: {
              userId: req.userid,
            },
          },
        },
      ],
    },
  });
  return res.send(docs);
});

docRouter.get("/getdoc", async (req, res) => {
  const bodyParsed = getDoc.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }
  const doc = await prisma.doc.findUnique({
    where: {
      id: bodyParsed.data.docId,
    },
  });
  return res.send(doc);
});

docRouter.post("/create", async (req, res) => {
  const doc = await prisma.doc.create({
    data: {
      title: "undefined",
      authorId: req.userid,
      role: DocRole.OWNER,
      content: {},
    },
  });

  return res.json(doc);
});

docRouter.put("/update", async (req, res) => {
  const bodyParsed = updateDoc.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }

  await prisma.doc.update({
    where: {
      id: bodyParsed.data.docId,
      authorId: req.userid,
    },
    data: {
      title: bodyParsed.data.title!,
      // role: bodyParsed.data.role as DocRole,
    },
  });

  return res.send("Succesfully added");
});

docRouter.post("/collab", async (req, res) => {
  const bodyParsed = collabDoc.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }

  const collabUser = await prisma.user.findUnique({
    where: {
      email: bodyParsed.data.email,
    },
    select: {
      id: true,
    },
  });

  if (!collabUser) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  if (collabUser.id === req.userid) {
    return res.status(400).json({ msg: "You are already owner of this file" });
  }

  await prisma.doc.update({
    where: { id: bodyParsed.data.docId },
    data: {
      collaborators: {
        connectOrCreate: {
          where: {
            docId_userId: {
              docId: bodyParsed.data.docId,
              userId: collabUser.id,
            },
          },
          create: {
            userId: collabUser.id,
          },
        },
      },
    },
  });

  return res.send("Successfully added user");
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
