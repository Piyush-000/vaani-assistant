import { sendCommand } from "./api";

export async function processCommand(
  command: string,
  updateStatus: (message: string) => void
) {
  const text = command.trim().toLowerCase();

  const words = text.split(/\s+/);

  if (words.length < 2) {
    updateStatus("Invalid command.");
    return;
  }

  const action = words[0];
  const target = words.slice(1).join(" ");

  if (
    action !== "open" &&
    action !== "launch" &&
    action !== "start"
  ) {
    updateStatus("Unsupported command.");
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
    updateStatus(`Unknown target: ${target}`);
    return;
  }

  updateStatus(`Opening ${mappedTarget}...`);

  try {
    const result = await sendCommand("open", mappedTarget);
    updateStatus(result.message);
  } catch {
    updateStatus("Unable to connect to backend.");
  }
}