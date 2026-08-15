import { sendCommand } from "./api";

type StatusUpdater = (message: string) => void;
type HistoryUpdater = (message: string) => void;

const aliases: Record<string, string> = {
  chrome: "chrome",
  "google chrome": "chrome",

  notepad: "notepad",

  calculator: "calculator",
  calc: "calculator",

  vscode: "vscode",
  "vs code": "vscode",
  "visual studio code": "vscode",

  explorer: "explorer",
  "file explorer": "explorer",

  downloads: "downloads",
  download: "downloads",
  "downloads folder": "downloads",

  documents: "documents",
  document: "documents",
  docs: "documents",
  "documents folder": "documents",
};

const conversationalWords = new Set([
  "please",
  "can",
  "could",
  "would",
  "you",
  "will",
  "kindly",
  "i",
  "want",
  "to",
  "my",
  "the",
  "a",
  "an",
  "for",
  "me",
]);

const actionWords = new Set([
  "open",
  "launch",
  "start",
]);

function cleanCommand(command: string): string {
  return command
    .trim()
    .toLowerCase()
    .replace(/[?!.,]/g, "")
    .replace(/\s+/g, " ");
}

function findTarget(text: string): string | null {
  const sortedAliases = Object.keys(aliases).sort(
    (a, b) => b.length - a.length
  );

  for (const alias of sortedAliases) {
    if (
      text === alias ||
      text.endsWith(` ${alias}`)
    ) {
      return aliases[alias];
    }
  }

  return null;
}

export async function processCommand(
  command: string,
  setStatus: StatusUpdater,
  addHistory?: HistoryUpdater
) {
  const text = cleanCommand(command);

  if (!text) {
    setStatus("Please enter a command.");
    addHistory?.("Please enter a command.");
    return;
  }

  const words = text.split(/\s+/);

  const action = words.find((word) =>
    actionWords.has(word)
  );

  if (!action) {
    const message = "I don't understand that command yet.";
    setStatus(message);
    addHistory?.(message);
    return;
  }

  const actionIndex = words.indexOf(action);

  const targetWords = words
    .slice(actionIndex + 1)
    .filter(
      (word) => !conversationalWords.has(word)
    );

  const targetText = targetWords.join(" ");

  if (!targetText) {
    const message =
      "Please tell me what you want me to open.";
    setStatus(message);
    addHistory?.(message);
    return;
  }

  const mappedTarget = findTarget(targetText);

  if (!mappedTarget) {
    const message = `I don't know how to open "${targetText}" yet.`;
    setStatus(message);
    addHistory?.(message);
    return;
  }

  setStatus(`Opening ${mappedTarget}...`);

  try {
    const result = await sendCommand(
      "open",
      mappedTarget
    );

    setStatus(result.message);
    addHistory?.(result.message);
  } catch {
    const message =
      "Unable to connect to backend.";

    setStatus(message);
    addHistory?.(message);
  }
}