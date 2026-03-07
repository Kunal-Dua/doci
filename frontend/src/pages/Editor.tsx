import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Delta, type EmitterSource } from "quill";
import DocToolBar from "../components/DocToolBar";
import { jwtDecode } from "jwt-decode";
import ReactQuill, { Quill } from "react-quill-new";
import QuillCursors from "quill-cursors";
Quill.register("modules/cursors", QuillCursors);
import "quill/dist/quill.snow.css";

const getColor = (id: string) => {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return `hsl(${Math.abs(hash) % 360},70%,50%)`;
};

type TokenPayload = {
  id: string;
  iat: number;
};

const modules = {
  toolbar: true,
  cursors: true,
};

const Editor = () => {
  const location = useLocation();
  const doc = location.state || {};
  const docId = doc?.id;
  const wsRef = useRef<WebSocket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<TokenPayload>(token) : null;
  const userId = decoded?.id;

  const userColorRef = useRef(getColor(userId!));
  const checkedAutoSaveSwitchRef = useRef(false);
  const [autoSave, setAutoSave] = useState(() => {
    const saved = localStorage.getItem("autosave");
    return saved === "true";
  });

  const handleToggleAutoSave = (value: boolean) => {
    if (!doc.title || doc.title === "undefined") {
      alert("Please enter title to enable auto save");
      return;
    }

    setAutoSave(value);
    checkedAutoSaveSwitchRef.current = value;
  };

  const onSave = () => {
    console.log("save");

    if (doc.title == "undefined" || doc.title == "") {
      alert("Please enter title");
      return;
    }
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current?.send(
        JSON.stringify({
          type: "save-changes",
        })
      );
    }
  };

  useEffect(() => {
    localStorage.setItem("autosave", autoSave.toString());
    if (!autoSave) return;

    if (autoSave) {
      const interval = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current?.send(
            JSON.stringify({
              type: "autosave-changes",
            })
          );
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoSave]);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_BACKEND_URL}/ws/doc/${docId}`);
    wsRef.current = ws;
    ws.onmessage = event => {
      if (!quillRef.current) return;
      const data = JSON.parse(event.data);
      const editor = quillRef.current.getEditor();

      if (data.type === "load-document") {
        editor.setContents(data.delta);
      }

      if (data.type === "receive-changes") {
        const range = editor.getSelection();
        const delta = new Delta(data.delta);

        editor.updateContents(delta);

        if (range) {
          const newIndex = delta.transformPosition(range.index);
          editor.setSelection(newIndex, range.length);
        }
      }

      if (data.type === "receive-cursor-update") {
        if (data.userId === userId) return;

        const quill = quillRef.current?.getEditor();
        const cursors = quill?.getModule("cursors") as any;

        if (!cursors) return;

        const existing = cursors.cursors().find((c: any) => c.id === data.userId);

        if (!existing) {
          cursors.createCursor(data.userId, data.userId, data.color);
        }
        cursors.moveCursor(data.userId, data.cursor);
      }
    };

    // ws.onopen = () => {
    //   ws.send(
    //     JSON.stringify({
    //       type: "send-changes",
    //       delta: "hello",
    //     })
    //   );
    // };

    return () => {
      // onSave();
      ws.close();
    };
  }, []);

  const handleChange = (
    value: string,
    delta: Delta,
    source: EmitterSource,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && source === "user") {
      ws.send(
        JSON.stringify({
          type: "send-changes",
          delta,
          userId,
        })
      );
    }
  };

  const handleChangeSelection = (
    selection: ReactQuill.Range,
    source: EmitterSource,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    const ws = wsRef.current;
    const range = selection;

    // if (!range || !selection) return;

    if (ws && ws.readyState === WebSocket.OPEN && source == "user") {
      ws.send(
        JSON.stringify({
          type: "cursor-update",
          cursor: selection,
          docId,
          userId,
          color: userColorRef.current,
        })
      );
    }
  };

  return (
    <>
      <DocToolBar
        doc={doc}
        onSave={onSave}
        autoSave={autoSave}
        onToggleAutoSave={handleToggleAutoSave}
      />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        onChange={handleChange}
        onChangeSelection={handleChangeSelection}
        modules={modules}
      />
    </>
  );
};

export default Editor;
