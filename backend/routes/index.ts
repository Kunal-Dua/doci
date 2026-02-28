import express from "express";
import { userRouter } from "./user.js";
import { docRouter } from "./doc.js";

const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/doc", docRouter);

export { rootRouter };
