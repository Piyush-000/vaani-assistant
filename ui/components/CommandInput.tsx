"use client";

import { FormEvent, useState } from "react";

type Props = {
  onExecute: (command: string) => void;
};

export default function CommandInput({
  onExecute,
}: Props) {
  const [command, setCommand] = useState("");

  function executeCommand(event: FormEvent) {
    event.preventDefault();

    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      return;
    }

    onExecute(trimmedCommand);
    setCommand("");
  }

  return (
    <form
      onSubmit={executeCommand}
      className="w-full"
    >
      <div className="flex flex-col gap-3 sm:flex-row">

        <div className="relative flex-1">
          <input
            type="text"
            value={command}
            onChange={(event) =>
              setCommand(event.target.value)
            }
            placeholder="Type a command... e.g. open chrome"
            aria-label="Vaani command"
            autoComplete="off"
            className="
              w-full
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              px-5
              py-4
              pr-5
              text-base
              text-white
              placeholder:text-zinc-600
              outline-none
              transition-all
              duration-200
              focus:border-zinc-600
              focus:ring-2
              focus:ring-zinc-700
              sm:text-lg
            "
          />
        </div>

        <button
          type="submit"
          disabled={!command.trim()}
          className="
            rounded-2xl
            border
            border-zinc-700
            bg-zinc-800
            px-7
            py-4
            text-base
            font-semibold
            text-white
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-zinc-700
            active:translate-y-0
            disabled:cursor-not-allowed
            disabled:opacity-40
            sm:text-lg
          "
        >
          Execute
        </button>

      </div>

      <p className="mt-2 text-xs text-zinc-600">
        Press Enter to execute your command.
      </p>
    </form>
  );
}