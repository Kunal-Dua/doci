import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import { useLocation } from "react-router-dom";
import "quill/dist/quill.snow.css";
import type { Delta } from "quill";

type Sources = "user" | "api" | "silent";

const Editor = () => {
  const location = useLocation();
  const docId = location.state || {};
  const [data, setData] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  async function callWS() {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/doc/${docId}`);
  }

  // useEffect(() => {
  //   console.log("Data changed:", data);
  // }, [data]);

  useEffect(() => {
    callWS();

    const ws = new WebSocket(`${import.meta.env.VITE_WS_BACKEND_URL}/ws/doc/${docId}`);
    wsRef.current = ws;
    ws.onmessage = event => {
      if (!quillRef.current) return;
      const data = JSON.parse(event.data);
      const editor = quillRef.current.getEditor();
      
      if (data.type === "load-document") {
        console.log(data.delta);

        editor.setContents(data.delta);
        // setData(m => m + data.delta);
      }

      if (data.type === "receive-changes") {
        editor.updateContents(data.delta);
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

  const handleChange = (value: string, delta: Delta, source: Sources) => {
    setData(value);

    const ws = wsRef.current;

    if (ws && ws.readyState === WebSocket.OPEN && source === "user") {
      ws.send(
        JSON.stringify({
          type: "send-changes",
          delta,
        })
      );
    }
  };

  return <ReactQuill ref={quillRef} theme="snow" value={data} onChange={handleChange} />;
};

export default Editor;
