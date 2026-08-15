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
  "now",
  "again",
]);

const actionWords = new Set([
  "open",
  "launch",
  "start",
]);

const contextWords = new Set([
  "it",
  "that",
  "this",
  "same",
]);

const LAST_TARGET_KEY = "vaani_last_target";

let lastTarget: string | null = null;

function loadLastTarget(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(
      LAST_TARGET_KEY
    );
  } catch {
    return null;
  }
}

function saveLastTarget(target: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      LAST_TARGET_KEY,
      target
    );
  } catch {
    // Ignore localStorage errors.
  }
}

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

function splitCommands(command: string): string[] {
  const parts = command.split(
    /\s+(?:and\s+then|then|and)\s+/i
  );

  return parts
    .map((part) => part.trim())
    .filter(Boolean);
}

function addMissingAction(command: string): string {
  const text = cleanCommand(command);

  const hasAction = text
    .split(/\s+/)
    .some((word) => actionWords.has(word));

  if (hasAction) {
    return text;
  }

  return `open ${text}`;
}

function resolveContextTarget(
  targetText: string
): string | null {
  const words = targetText.split(/\s+/);

  const containsContextWord = words.some((word) =>
    contextWords.has(word)
  );

  if (!containsContextWord) {
    return null;
  }

  if (!lastTarget) {
    lastTarget = loadLastTarget();
  }

  return lastTarget;
}

async function executeSingleCommand(
  command: string,
  setStatus: StatusUpdater,
  addHistory?: HistoryUpdater
): Promise<boolean> {
  const text = cleanCommand(command);

  if (!text) {
    return false;
  }

  const words = text.split(/\s+/);

  const action = words.find((word) =>
    actionWords.has(word)
  );

  if (!action) {
    const message =
      "I don't understand that command yet.";

    setStatus(message);
    addHistory?.(message);

    return false;
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

    return false;
  }

  let mappedTarget = findTarget(targetText);

  /*
   * Context support:
   *
   * Example:
   *
   * open chrome
   * open it
   *
   * "it" refers to Chrome.
   */
  if (!mappedTarget) {
    mappedTarget =
      resolveContextTarget(targetText);
  }

  if (!mappedTarget) {
    const contextMessage = contextWords.has(
      targetText
    )
      ? "I don't have a previous command to refer to."
      : `I don't know how to open "${targetText}" yet.`;

    setStatus(contextMessage);
    addHistory?.(contextMessage);

    return false;
  }

  setStatus(`Opening ${mappedTarget}...`);

  try {
    const result = await sendCommand(
      "open",
      mappedTarget
    );

    setStatus(result.message);
    addHistory?.(result.message);

    /*
     * Save only successful targets.
     *
     * This gives Vaani persistent context even
     * after refreshing the browser.
     */
    if (result.success !== false) {
      lastTarget = mappedTarget;
      saveLastTarget(mappedTarget);
    }

    return result.success !== false;
  } catch {
    const message =
      "Unable to connect to backend.";

    setStatus(message);
    addHistory?.(message);

    return false;
  }
}

export async function processCommand(
  command: string,
  setStatus: StatusUpdater,
  addHistory?: HistoryUpdater
) {
  const text = cleanCommand(command);

  if (!text) {
    const message = "Please enter a command.";

    setStatus(message);
    addHistory?.(message);

    return;
  }

  const commands = splitCommands(text);

  for (const currentCommand of commands) {
    const normalizedCommand =
      addMissingAction(currentCommand);

    await executeSingleCommand(
      normalizedCommand,
      setStatus,
      addHistory
    );
  }
}
