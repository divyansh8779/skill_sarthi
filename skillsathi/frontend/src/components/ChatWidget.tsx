import React, { useState, useRef } from "react";
import client from "../api/client";
import MicRecorder from "./MicRecorder";
import { useTranslation } from "react-i18next";

export default function ChatWidget() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<{from: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function sendText(msg?: string) {
    const message = msg ?? input;
    if (!message) return;
    setMessages(m => [...m, {from: "user", text: message}]);
    setInput("");
    const r = await client.post("/ai/chat", { message, language: i18n.language });
    setMessages(m => [...m, {from: "bot", text: r.data.text}]);
  }

  async function handleTranscribed(text: string) {
    setInput(text);
    // Optionally auto-send
    await sendText(text);
  }

  async function speakText(text: string) {
    // Call backend synthesize; if backend returns note, use browser TTS
    const form = new FormData();
    form.append("text", text);
    form.append("language", i18n.language);
    try {
      const r = await client.post("/ai/synthesize", form, { responseType: "arraybuffer" });
      // If binary audio returned, create blob and play
      const contentType = r.headers["content-type"];
      if (contentType && r.data) {
        const blob = new Blob([r.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        if (audioRef.current) audioRef.current.src = url;
        audioRef.current?.play();
        return;
      }
    } catch (err) {
      // fallback to browser TTS
    }
    // Browser TTS fallback
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = i18n.language === "hi" ? "hi-IN" : "en-US";
    speechSynthesis.speak(utter);
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-2 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
            <div className={`inline-block p-2 rounded ${m.from === "user" ? "bg-blue-100" : "bg-gray-100"}`}>{m.text}</div>
            {m.from === "bot" && <button className="ml-2 text-sm" onClick={()=>speakText(m.text)}>🔊</button>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <MicRecorder onTranscribed={handleTranscribed} />
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder={t("chat_placeholder")} className="flex-1 p-2 border" />
        <button onClick={()=>sendText()} className="bg-indigo-600 text-white px-3 py-2">Send</button>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}
