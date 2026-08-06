import { sendCommand } from "./api";

export async function processCommand(
  command: string,
  setStatus: (message: string) => void,
  addHistory?: (message: string) => void
) {
  const text = command.trim().toLowerCase();

  const words = text.split(/\s+/);

  if (words.length < 2) {
    setStatus("Invalid command.");
    addHistory?.("Invalid command.");
    return;
  }

  const action = words[0];
  const target = words.slice(1).join(" ");

  if (
    action !== "open" &&
    action !== "launch" &&
    action !== "start"
  ) {
    setStatus("Unsupported command.");
    addHistory?.("Unsupported command.");
    return;
  }

  const aliases: Record<string, string> = {
    chrome: "chrome",
    "google chrome": "chrome",

    notepad: "notepad",

    calculator: "calculator",
    calc: "calculator",

    vscode: "vscode",
    "vs code": "vscode",

    explorer: "explorer",

    downloads: "downloads",
    download: "downloads",

    documents: "documents",
    docs: "documents",
  };

  const mappedTarget = aliases[target];

  if (!mappedTarget) {
    const message = `Unknown target: ${target}`;
    setStatus(message);
    addHistory?.(message);
    return;
  }

  // Show temporary status only
  setStatus(`Opening ${mappedTarget}...`);

  try {
    const result = await sendCommand("open", mappedTarget);

    // Final status
    setStatus(result.message);

    // Record only the final result
    addHistory?.(result.message);
  } catch {
    const message = "Unable to connect to backend.";
    setStatus(message);
    addHistory?.(message);
  }
}