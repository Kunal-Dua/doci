import WebSocket from "ws";

export class DocumnetManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private documnets = new Map<string, any>();
  private rooms = new Map<string, Set<WebSocket>>();

  join(docId: string, ws: WebSocket) {
    if (!this.rooms.has(docId)) {
      this.rooms.set(docId, new Set());
      this.documnets.set(docId, []);
    }

    this.rooms.get(docId)!.add(ws);
  }

  leave(docId: string, ws: WebSocket) {
    this.rooms.get(docId)?.delete(ws);
  }

  get(docId: string) {
    return this.documnets.get(docId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(docId: string, delta: any) {
    // this.documnets.set(docId, delta);
    this.documnets.get(docId).push(delta);
  }

  broadcast(docId: string, sender: WebSocket, message: string) {
    this.rooms.get(docId)?.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
