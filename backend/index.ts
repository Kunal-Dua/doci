import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { rootRouter } from "./routes/index.js";
import { initWebSocket } from "./ws/wsServer.js";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

initWebSocket(server);
