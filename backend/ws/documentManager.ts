import WebSocket from "ws";
import Delta from "quill-delta";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

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

  async get(docId: string) {
    const dbDoc = await prisma.doc.findUnique({
      where: {
        id: docId,
      },
      select: {
        content: true,
      },
    });
    if (!dbDoc) return new Delta();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const delta = new Delta(dbDoc.content as any);
    this.documnets.set(docId, delta);
    
    return delta;
  }

  update(docId: string, delta: Delta) {
    const incoming = new Delta(delta);

    let doc = this.documnets.get(docId) ?? new Delta();
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

  async save(docId: string) {
    let doc = this.documnets.get(docId);
    if (!doc) {
      doc = new Delta();
    }

    await prisma.doc.update({
      where: {
        id: docId,
      },
      data: {
        content: doc.ops as Prisma.InputJsonValue,
      },
    });
  }

  //TODO: add collab logic
  async addCollab(docId: string) {}

  //TODO: add auto save
}
