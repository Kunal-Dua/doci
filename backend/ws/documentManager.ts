import WebSocket from "ws";
import Delta from "quill-delta";

export class DocumnetManager {
  private documnets = new Map<string, Delta>();
  private rooms = new Map<string, Set<WebSocket>>();

  join(docId: string, ws: WebSocket) {
    if (!this.rooms.has(docId)) {
      this.rooms.set(docId, new Set());
      this.documnets.set(docId, new Delta());
    }

    this.rooms.get(docId)!.add(ws);
  }

  leave(docId: string, ws: WebSocket) {
    this.rooms.get(docId)?.delete(ws);
  }

  get(docId: string) {
    return this.documnets.get(docId);
  }

  update(docId: string, delta: Delta) {
    const incoming = new Delta(delta);

    let doc = this.documnets.get(docId);
    if (!doc) {
      doc = new Delta();
    }
    doc = doc.compose(incoming);
    this.documnets.set(docId, doc);
  }

  broadcast(docId: string, sender: WebSocket, message: string) {
    this.rooms.get(docId)?.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
