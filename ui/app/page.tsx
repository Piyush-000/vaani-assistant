"use client";

import { useState } from "react";

import BackendStatus from "@/components/BackendStatus";
import CommandButton from "@/components/CommandButton";
import CommandInput from "@/components/CommandInput";
import StatusCard from "@/components/StatusCard";

import { processCommand } from "@/lib/commandEngine";

export default function Home() {
  function updateStatus(message: string) {
  setStatus(message);

  setHistory((previous) => [
    message,
    ...previous.slice(0, 9),
  ]);
}
  const [status, setStatus] = useState("Ready...");
  const [history, setHistory] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-5xl font-bold tracking-wide">
          VAANI
        </h1>

        <p className="mt-2 text-zinc-400">
          Your Personal AI Assistant
        </p>

        <div className="mt-8">
          <BackendStatus />
        </div>

        <div className="mt-6">
          <CommandInput
            onExecute={(command) =>
              processCommand(command, setStatus)
            }
          />
        </div>

        <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="mb-6 text-2xl font-semibold">
            Applications
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            <CommandButton
              label="🌐 Chrome"
              onClick={() =>
                processCommand("open chrome", updateStatus)
              }
            />

            <CommandButton
              label="💻 VS Code"
              onClick={() =>
                processCommand("open vscode", updateStatus)
              }
            />

            <CommandButton
              label="📝 Notepad"
              onClick={() =>
                processCommand("open notepad", updateStatus)
              }
            />

            <CommandButton
              label="🧮 Calculator"
              onClick={() =>
                processCommand("open calculator", updateStatus)
              }
            />

            <CommandButton
              label="📁 Explorer"
              onClick={() =>
                processCommand("open explorer", updateStatus)
              }
            />

          </div>

        </div>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="mb-6 text-2xl font-semibold">
            Folders
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            <CommandButton
              label="📂 Downloads"
              onClick={() =>
                processCommand("open downloads", updateStatus)
              }
            />

            <CommandButton
              label="📄 Documents"
              onClick={() =>
                processCommand("open documents", updateStatus)
              }
            />

          </div>

        </div>

        <StatusCard message={status} />

      </div>
    </main>
  );
}