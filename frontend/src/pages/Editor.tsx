import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import { useLocation } from "react-router-dom";
import { Delta, type EmitterSource } from "quill";
import DocToolBar from "../components/DocToolBar";
import "quill/dist/quill.snow.css";

const Editor = () => {
  const location = useLocation();
  const doc = location.state || {};
  const docId = doc?.id;
  const wsRef = useRef<WebSocket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

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
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "send-changes",
          delta: "hello",
        })
      );
    };

    return () => {
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
    const cursor = editor.getSelection();
    if (ws && ws.readyState === WebSocket.OPEN && source === "user") {
      ws.send(
        JSON.stringify({
          type: "send-changes",
          delta,
          cursor,
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
      <ReactQuill ref={quillRef} theme="snow" onChange={handleChange} />
    </>
  );
};

export default Editor;
