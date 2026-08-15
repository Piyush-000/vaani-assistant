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

const repeatCommands = new Set([
  "repeat",
  "repeat last",
  "repeat the last",
  "repeat last command",
  "repeat the last command",
  "repeat last app",
  "repeat the last app",
  "repeat last application",
  "repeat the last application",
]);

const queryCommands = new Set([
  "what did i open",
  "what did i open last",
  "what did i open recently",
  "what was my previous command",
  "what was the previous command",
  "what was my last command",
  "what was the last app",
  "what was the last application",
  "what did i launch last",
  "what did i start last",
]);

const LAST_TARGET_KEY = "vaani_last_target";
const LAST_COMMAND_KEY = "vaani_last_command";

let lastTarget: string | null = null;
let lastCommand: string | null = null;

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

function loadLastCommand(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(
      LAST_COMMAND_KEY
    );
  } catch {
    return null;
  }
}

function saveLastCommand(command: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      LAST_COMMAND_KEY,
      command
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

function isRepeatCommand(text: string): boolean {
  return repeatCommands.has(text);
}

function isQueryCommand(text: string): boolean {
  return queryCommands.has(text);
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

function resolveLastTarget(): string | null {
  if (!lastTarget) {
    lastTarget = loadLastTarget();
  }

  return lastTarget;
}

function resolveLastCommand(): string | null {
  if (!lastCommand) {
    lastCommand = loadLastCommand();
  }

  return lastCommand;
}

function getDisplayName(target: string): string {
  const displayNames: Record<string, string> = {
    chrome: "Chrome",
    notepad: "Notepad",
    calculator: "Calculator",
    vscode: "VS Code",
    explorer: "File Explorer",
    downloads: "Downloads",
    documents: "Documents",
  };

  return displayNames[target] ?? target;
}

async function executeTarget(
  target: string,
  originalCommand: string,
  setStatus: StatusUpdater,
  addHistory?: HistoryUpdater
): Promise<boolean> {
  setStatus(`Opening ${target}...`);

  try {
    const result = await sendCommand(
      "open",
      target
    );

    setStatus(result.message);
    addHistory?.(result.message);

    if (result.success !== false) {
      lastTarget = target;
      saveLastTarget(target);

      lastCommand = originalCommand;
      saveLastCommand(originalCommand);
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

async function executeSingleCommand(
  command: string,
  setStatus: StatusUpdater,
  addHistory?: HistoryUpdater
): Promise<boolean> {
  const text = cleanCommand(command);

  if (!text) {
    return false;
  }

  /*
   * Query commands must be checked before
   * normal command parsing.
   */
  if (isQueryCommand(text)) {
    const target = resolveLastTarget();
    const previousCommand = resolveLastCommand();

    if (!target) {
      const message =
        "I don't have a previous command yet.";

      setStatus(message);
      addHistory?.(message);

      return false;
    }

    const displayName =
      getDisplayName(target);

    let message: string;

    if (
      text.includes("previous command") ||
      text.includes("last command")
    ) {
      message = previousCommand
        ? `Your previous command was: "${previousCommand}".`
        : `You last opened ${displayName}.`;
    } else {
      message =
        `You last opened ${displayName}.`;
    }

    setStatus(message);
    addHistory?.(message);

    return true;
  }

  /*
   * Repeat commands must be checked before
   * normal command parsing.
   */
  if (isRepeatCommand(text)) {
    const target = resolveLastTarget();

    if (!target) {
      const message =
        "There is no previous command to repeat.";

      setStatus(message);
      addHistory?.(message);

      return false;
    }

    return executeTarget(
      target,
      `open ${target}`,
      setStatus,
      addHistory
    );
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

  return executeTarget(
    mappedTarget,
    text,
    setStatus,
    addHistory
  );
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

  /*
   * Do not add a missing action here.
   * Commands such as "repeat" and
   * "what did i open last" must reach
   * executeSingleCommand unchanged.
   */
  for (const currentCommand of commands) {
    await executeSingleCommand(
      currentCommand,
      setStatus,
      addHistory
    );
  }
}
