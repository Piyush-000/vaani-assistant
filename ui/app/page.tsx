"use client";

import { useState } from "react";

import BackendStatus from "@/components/BackendStatus";
import CommandButton from "@/components/CommandButton";
import CommandHistory from "@/components/CommandHistory";
import CommandInput from "@/components/CommandInput";
import StatusCard from "@/components/StatusCard";
import VoiceButton from "@/components/VoiceButton";

import { processCommand } from "@/lib/commandEngine";

type CommandHistoryItem = {
  message: string;
  success: boolean;
  time: string;
};

type AppItem = {
  label: string;
  command: string;
};

type FolderItem = {
  label: string;
  command: string;
};

const applications: AppItem[] = [
  {
    label: "🌐 Chrome",
    command: "open chrome",
  },
  {
    label: "💻 VS Code",
    command: "open vscode",
  },
  {
    label: "📝 Notepad",
    command: "open notepad",
  },
  {
    label: "🧮 Calculator",
    command: "open calculator",
  },
  {
    label: "📁 Explorer",
    command: "open explorer",
  },
];

const folders: FolderItem[] = [
  {
    label: "📂 Downloads",
    command: "open downloads",
  },
  {
    label: "📄 Documents",
    command: "open documents",
  },
];

export default function Home() {
  const [status, setStatus] =
    useState("Ready...");

  const [history, setHistory] =
    useState<CommandHistoryItem[]>([]);

  function clearHistory() {
    setHistory([]);
  }

  function addHistory(message: string) {
    const normalizedMessage =
      message.trim().toLowerCase();

    /*
     * Do not add temporary/progress messages.
     */
    if (
      normalizedMessage.startsWith(
        "opening "
      ) ||
      normalizedMessage === "listening..." ||
      normalizedMessage.startsWith("heard:")
    ) {
      return;
    }

    /*
     * Known failure messages.
     */
    const failure =
      normalizedMessage.includes(
        "i don't understand"
      ) ||
      normalizedMessage.includes(
        "i don't know"
      ) ||
      normalizedMessage.includes(
        "unable to connect"
      ) ||
      normalizedMessage.includes(
        "there is no previous command"
      ) ||
      normalizedMessage.includes(
        "i don't have a previous command"
      ) ||
      normalizedMessage.includes(
        "please tell me"
      ) ||
      normalizedMessage.includes(
        "invalid command"
      ) ||
      normalizedMessage.includes(
        "unsupported command"
      ) ||
      normalizedMessage.includes(
        "not found"
      ) ||
      normalizedMessage.includes(
        "error:"
      );

    /*
     * Known successful action/query messages.
     */
    const success =
      !failure &&
      (
        normalizedMessage.includes(
          "successfully"
        ) ||
        normalizedMessage.includes(
          "opened"
        ) ||
        normalizedMessage.includes(
          "your previous command was"
        ) ||
        normalizedMessage.includes(
          "you last opened"
        ) ||
        normalizedMessage.includes(
          "your last"
        ) ||
        normalizedMessage.includes(
          "your recent commands"
        ) ||
        normalizedMessage.includes(
          "vanni memory cleared successfully"
        ) ||
        normalizedMessage.includes(
          "vanni memory cleared"
        )
      );

    const time =
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    setHistory((previous) => [
      {
        message,
        success,
        time,
      },
      ...previous.slice(0, 9),
    ]);
  }

  function executeCommand(
    command: string
  ) {
    processCommand(
      command,
      setStatus,
      addHistory,
      clearHistory
    );
  }

  function handleVoiceCommand(
    command: string
  ) {
    executeCommand(command);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="mb-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-2xl shadow-lg">
                  🤖
                </div>

                <div>
                  <h1 className="text-4xl font-bold tracking-wider sm:text-5xl">
                    VAANI
                  </h1>

                  <p className="mt-1 text-sm text-zinc-400 sm:text-base">
                    Your Personal AI Assistant
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
              AI Desktop Assistant
            </div>

          </div>

        </header>


        {/* ==================================================
            BACKEND STATUS
        ================================================== */}

        <section className="mb-6">
          <BackendStatus />
        </section>


        {/* ==================================================
            COMMAND CENTER
        ================================================== */}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl sm:p-6">

          <div className="mb-5">

            <h2 className="text-xl font-semibold">
              Command Center
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Type a command or use your voice.
            </p>

          </div>

          <div className="space-y-4">

            <CommandInput
              onExecute={executeCommand}
            />

            <VoiceButton
              onCommand={handleVoiceCommand}
              onStatusChange={setStatus}
            />

          </div>

          <div className="mt-4 flex flex-wrap gap-2">

            <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
              Try: open chrome
            </span>

            <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
              Try: repeat
            </span>

            <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
              Try: open it
            </span>

          </div>

        </section>


        {/* ==================================================
            APPLICATIONS
        ================================================== */}

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl sm:p-6">

          <div className="mb-6">

            <h2 className="text-2xl font-semibold">
              Applications
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Launch applications directly from Vaani.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

            {applications.map(
              (application) => (
                <CommandButton
                  key={application.command}
                  label={application.label}
                  onClick={() =>
                    executeCommand(
                      application.command
                    )
                  }
                />
              )
            )}

          </div>

        </section>


        {/* ==================================================
            FOLDERS
        ================================================== */}

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl sm:p-6">

          <div className="mb-6">

            <h2 className="text-2xl font-semibold">
              Folders
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Quickly access common Windows folders.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {folders.map(
              (folder) => (
                <CommandButton
                  key={folder.command}
                  label={folder.label}
                  onClick={() =>
                    executeCommand(
                      folder.command
                    )
                  }
                />
              )
            )}

          </div>

        </section>


        {/* ==================================================
            STATUS
        ================================================== */}

        <section className="mt-6">

          <StatusCard
            message={status}
          />

        </section>


        {/* ==================================================
            COMMAND HISTORY
        ================================================== */}

        <section className="mt-6">

          <CommandHistory
            history={history}
          />

        </section>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="mt-10 border-t border-zinc-900 pt-6 text-center text-xs text-zinc-600">

          VAANI • Personal AI Desktop Assistant

        </footer>

      </div>
    </main>
  );
}