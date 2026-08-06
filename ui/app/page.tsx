"use client";

import { useState } from "react";

import BackendStatus from "@/components/BackendStatus";
import CommandButton from "@/components/CommandButton";
import CommandHistory from "@/components/CommandHistory";
import CommandInput from "@/components/CommandInput";
import StatusCard from "@/components/StatusCard";

import { processCommand } from "@/lib/commandEngine";

type CommandHistoryItem = {
  message: string;
  success: boolean;
  time: string;
};

export default function Home() {
  const [status, setStatus] = useState("Ready...");
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);

  function addHistory(message: string) {
    const success =
      message.toLowerCase().includes("successfully") ||
      message.toLowerCase().includes("opened");

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setHistory((previous) => [
      {
        message,
        success,
        time,
      },
      ...previous.slice(0, 9),
    ]);
  }

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
              processCommand(
                command,
                setStatus,
                addHistory
              )
            }
          />
        </div>

        <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="mb-6 text-2xl font-semibold">
            Applications
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

            <CommandButton
              label="🌐 Chrome"
              onClick={() =>
                processCommand(
                  "open chrome",
                  setStatus,
                  addHistory
                )
              }
            />

            <CommandButton
              label="💻 VS Code"
              onClick={() =>
                processCommand(
                  "open vscode",
                  setStatus,
                  addHistory
                )
              }
            />

            <CommandButton
              label="📝 Notepad"
              onClick={() =>
                processCommand(
                  "open notepad",
                  setStatus,
                  addHistory
                )
              }
            />

            <CommandButton
              label="🧮 Calculator"
              onClick={() =>
                processCommand(
                  "open calculator",
                  setStatus,
                  addHistory
                )
              }
            />

            <CommandButton
              label="📁 Explorer"
              onClick={() =>
                processCommand(
                  "open explorer",
                  setStatus,
                  addHistory
                )
              }
            />

          </div>

        </div>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="mb-6 text-2xl font-semibold">
            Folders
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

            <CommandButton
              label="📂 Downloads"
              onClick={() =>
                processCommand(
                  "open downloads",
                  setStatus,
                  addHistory
                )
              }
            />

            <CommandButton
              label="📄 Documents"
              onClick={() =>
                processCommand(
                  "open documents",
                  setStatus,
                  addHistory
                )
              }
            />

          </div>

        </div>

        <StatusCard message={status} />

        <CommandHistory history={history} />

      </div>
    </main>
  );
}