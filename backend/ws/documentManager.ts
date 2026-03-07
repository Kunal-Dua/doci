import WebSocket from "ws";
import Delta from "quill-delta";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { useRef } from "react";
export class DocumnetManager {
  private documnets = new Map<string, Delta>();
  private rooms = new Map<string, Set<WebSocket>>();
  private dirtyDocs = new Set<string>();
  private saving = false;

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
    this.dirtyDocs.add(docId);
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

  cursorUpdate(docId: string, sender: WebSocket, userId: string, cursor: Range, color: string) {
    const clients = this.rooms.get(docId);
    clients?.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "receive-cursor-update",
            userId,
            cursor,
            color,
          }),
        );
      }
    });
  }

  async autoSave() {
    if (this.saving) return;
    this.saving = true;
    try {
      for (const docId of this.dirtyDocs) {
        await this.save(docId);
      }
    } finally {
      this.saving = false;
    }
  }

  async save(docId: string) {
    let doc = this.documnets.get(docId);
    if (!doc) {
      doc = new Delta();
    }

    if (!this.dirtyDocs.has(docId)) {
      console.log("already saved no new update");
      return;
    }

    await prisma.doc.update({
      where: {
        id: docId,
      },
      data: {
        content: doc.ops as Prisma.InputJsonValue,
      },
    });
    this.dirtyDocs.delete(docId);
  }
}
