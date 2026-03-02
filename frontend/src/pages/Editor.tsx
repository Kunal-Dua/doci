import axios from "axios";
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
  const [data, setData] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  // useEffect(() => {
  //   console.log("Data changed:", data);
  // }, [data]);

  const onSave = () => {
    // if (doc.title == "undefined") {
    //   alert("Please enter title");
    //   return;
    // }
    console.log(wsRef.current);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current?.send(
        JSON.stringify({
          type: "save-changes",
        })
      );
    }
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/doc/d/${docId}`).catch(err => {
      console.error("Something went wrong cant fetch document");
    });

    const ws = new WebSocket(`${import.meta.env.VITE_WS_BACKEND_URL}/ws/doc/${docId}`);
    wsRef.current = ws;
    ws.onmessage = event => {
      if (!quillRef.current) return;
      const data = JSON.parse(event.data);
      const editor = quillRef.current.getEditor();

      if (data.type === "load-document") {
        editor.setContents(data.delta);
        // setData(m => m + data.delta);
      }

      if (data.type === "receive-changes") {
        const range = editor.getSelection();
        const delta = new Delta(data.delta);

        editor.updateContents(delta);

        if (range) {
          const newIndex = delta.transformPosition(range.index);
          editor.setSelection(newIndex, range.length);
        }
        // editor.updateContents(data.delta);
        // setData(m => m + data.delta);
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
    // setData(value);

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
      <DocToolBar doc={doc} onSave={onSave} />
      <ReactQuill ref={quillRef} theme="snow" value={data} onChange={handleChange} />
    </>
  );
};

export default Editor;
