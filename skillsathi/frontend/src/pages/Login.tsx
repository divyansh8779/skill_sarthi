import React, { useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await client.post("/auth/login", { email, password });
      localStorage.setItem("access_token", r.data.access_token);
      nav("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input className="w-full p-2 mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full p-2 mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2">Login</button>
    </form>
  );
}
