import React, { useEffect, useRef, useState } from "react";
import client from "../api/client";

export default function MicRecorder({ onTranscribed }: { onTranscribed: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    };
  }, []);

  async function start() {
    if (!navigator.mediaDevices) {
      alert("Microphone not supported");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const form = new FormData();
      form.append("file", blob, "voice.webm");
      try {
        const r = await client.post("/ai/transcribe", form, { headers: { "Content-Type": "multipart/form-data" } });
        onTranscribed(r.data.text);
      } catch (err) {
        alert("Transcription failed");
      }
    };
    mr.start();
    setRecording(true);
  }

  function stop() {
    mediaRef.current?.stop();
    setRecording(false);
  }

  return (
    <div>
      {!recording ? (
        <button onClick={start} className="p-2 bg-green-500 text-white rounded">🎤</button>
      ) : (
        <button onClick={stop} className="p-2 bg-red-500 text-white rounded">⏹</button>
      )}
    </div>
  );
}
