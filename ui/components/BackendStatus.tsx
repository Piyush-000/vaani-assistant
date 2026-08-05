"use client";

import { useEffect, useState } from "react";

export default function BackendStatus() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function checkBackend() {
      try {
        const response = await fetch("http://127.0.0.1:8000/health", {
          cache: "no-store",
        });

        if (!response.ok) {
          setOnline(false);
          return;
        }

        const data = await response.json();

        setOnline(data.status === "running");
      } catch (error) {
        console.error("Backend connection failed:", error);
        setOnline(false);
      }
    }

    checkBackend();

    interval = setInterval(checkBackend, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8">
      {online ? (
        <div className="inline-flex items-center rounded-lg bg-green-900/30 px-4 py-2 text-green-400 border border-green-700">
          🟢 Backend Online
        </div>
      ) : (
        <div className="inline-flex items-center rounded-lg bg-red-900/30 px-4 py-2 text-red-400 border border-red-700">
          🔴 Backend Offline
        </div>
      )}
    </div>
  );
}