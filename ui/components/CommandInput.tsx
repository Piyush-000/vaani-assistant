"use client";

import { useState } from "react";

type Props = {
  onExecute: (command: string) => void;
};

export default function CommandInput({ onExecute }: Props) {
  const [command, setCommand] = useState("");

  return (
    <div className="mt-8">
      <input
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
        placeholder="Type a command (example: open chrome)"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onExecute(command);
            setCommand("");
          }
        }}
      />
    </div>
  );
}