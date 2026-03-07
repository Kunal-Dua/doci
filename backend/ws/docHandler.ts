import { WebSocket } from "ws";
import { DocumnetManager } from "./documentManager.js";

const docManager = new DocumnetManager();
export async function handleDocumentSocket(ws: WebSocket, docId?: string) {
  if (!docId) {
    return ws.close();
  }

  docManager.join(docId, ws);

  ws.send(
    JSON.stringify({
      type: "load-document",
      delta: await docManager.get(docId),
    }),
  );

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.type === "send-changes") {
      docManager.update(docId, data.delta);

      docManager.broadcast(
        docId,
        ws,
        JSON.stringify({
          type: "receive-changes",
          delta: data.delta,
        }),
      );
    }

    if (data.type === "save-changes") {
      docManager.save(docId);
    }
    if (data.type === "autosave-changes") {
      docManager.autoSave();
    }
  });

  ws.on("close", () => {
    docManager.leave(docId, ws);
  });
}
