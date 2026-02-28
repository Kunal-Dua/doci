import express from "express";
import { userSignin, userSignup, userUpdate } from "../schemas/userSchema.js";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const bodyParsed = userSignup.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: bodyParsed.data.email,
    },
  });

  if (existingUser) {
    return res.status(409).json({ msg: "User already exists" });
  }

  const user = await prisma.user.create({
    data: {
      email: bodyParsed.data.email,
      firstName: bodyParsed.data.firstName,
      lastName: bodyParsed.data.lastName ?? null,
      password: bodyParsed.data.password,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECERT!);
  return res.json(token);
});

userRouter.post("/signin", async (req, res) => {
  const bodyParsed = userSignin.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: bodyParsed.data.email,
      password: bodyParsed.data.password,
    },
  });

  if (!user) {
    return res.status(409).json({ msg: "User doesn't exist" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECERT!);
  return res.json(token);
});

userRouter.post("/update", authMiddleware, async (req, res) => {
  const bodyParsed = userUpdate.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }

  const user = await prisma.user.update({
    where: {
      email: req.userid,
    },
    data: {
      firstName: bodyParsed.data.firstName!,
      lastName: bodyParsed.data.lastName!,
      password: bodyParsed.data.password!,
    },
  });

  if (!user) {
    return res.status(409).json({ msg: "User doesn't exist" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECERT!);
  return res.json(token);
});

export { userRouter };
