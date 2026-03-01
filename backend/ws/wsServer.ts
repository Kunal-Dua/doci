import http from "http";
import { WebSocketServer } from "ws";
import { handleDocumentSocket } from "./docHandler.js";

export function initWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    const url = req.url || "";
    if (!url.startsWith("/ws/doc/")) {
      ws.close();
      return;
    }
    const docId = url.split("/").pop();
    handleDocumentSocket(ws, docId);

    ws.on("error", console.error);
  });
}
