import React, { useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await client.post("/auth/register", { email, password });
      alert("Registered. Please login.");
      nav("/login");
    } catch (err) {
      alert("Registration failed");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <input className="w-full p-2 mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full p-2 mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2">Register</button>
    </form>
  );
}
