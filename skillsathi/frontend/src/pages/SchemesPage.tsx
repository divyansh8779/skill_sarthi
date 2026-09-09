import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    client.get("/schemes").then(r => setSchemes(r.data)).catch(()=>{});
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Schemes</h2>
      <ul>
        {schemes.map(s => (
          <li key={s.id} className="mb-3 p-3 bg-white shadow rounded">
            <div className="font-bold">{s.title}</div>
            <div className="text-sm text-gray-600">{s.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
