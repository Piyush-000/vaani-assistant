import { sendCommand } from "./api";

type StatusUpdater = (message: string) => void;
type HistoryUpdater = (message: string) => void;
type ClearHistoryUpdater = () => void;

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
  "just",
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
  "repeat my previous command",
  "repeat my last command",
  "do it again",
  "do that again",
  "open it again",
  "launch it again",
  "start it again",
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

const recentCommands = new Set([
  "show recent commands",
  "show my recent commands",
  "show recent command",
  "show my recent command",
  "what are my recent commands",
  "what were my recent commands",
  "what were my last commands",
]);

const memoryResetCommands = new Set([
  "clear history",
  "clear my history",
  "clear memory",
  "clear my memory",
  "reset memory",
  "reset my memory",
  "reset history",
  "reset my history",
  "forget my history",
  "forget command history",
  "forget my memory",
  "forget memory",
]);

const LAST_TARGET_KEY = "vaani_last_target";
const LAST_COMMAND_KEY = "vaani_last_command";
const COMMAND_HISTORY_KEY = "vaani_command_history";

const MAX_COMMAND_HISTORY = 10;

let lastTarget: string | null = null;
let lastCommand: string | null = null;
let commandHistory: string[] = [];

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

function loadCommandHistory(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        COMMAND_HISTORY_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is string =>
        typeof item === "string"
    );
  } catch {
    return [];
  }
}

function saveCommandHistory(
  history: string[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      COMMAND_HISTORY_KEY,
      JSON.stringify(history)
    );
  } catch {
    // Ignore localStorage errors.
  }
}

function resolveCommandHistory(): string[] {
  if (commandHistory.length === 0) {
    commandHistory =
      loadCommandHistory();
  }

  return commandHistory;
}

function rememberCommand(
  command: string
): void {
  const cleaned = cleanCommand(command);

  if (!cleaned) {
    return;
  }

  const history =
    resolveCommandHistory();

  commandHistory = [
    cleaned,
    ...history.filter(
      (item) => item !== cleaned
    ),
  ].slice(0, MAX_COMMAND_HISTORY);

  saveCommandHistory(commandHistory);
}

function clearVaaniMemory(): void {
  lastTarget = null;
  lastCommand = null;
  commandHistory = [];

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      LAST_TARGET_KEY
    );

    window.localStorage.removeItem(
      LAST_COMMAND_KEY
    );

    window.localStorage.removeItem(
      COMMAND_HISTORY_KEY
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

function findTarget(
  text: string
): string | null {
  const sortedAliases =
    Object.keys(aliases).sort(
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
  const text = cleanCommand(command);
  const parts = text.split(
    /\s+(?:and\s+then|then|and)\s+/i
  );

  return parts
    .map((part) => part.trim())
    .filter(Boolean);
}

function isRepeatCommand(
  text: string
): boolean {
  return repeatCommands.has(text);
}

function isQueryCommand(
  text: string
): boolean {
  return queryCommands.has(text);
}

function isRecentCommandsQuery(
  text: string
): boolean {
  if (recentCommands.has(text)) {
    return true;
  }

  return /^what (?:are|were) my last \d+ commands?$/.test(
    text
  );
}

function isMemoryResetCommand(
  text: string
): boolean {
  if (memoryResetCommands.has(text)) {
    return true;
  }

  return (
    /^clear (?:my )?(?:history|memory)$/.test(
      text
    ) ||
    /^reset (?:my )?(?:history|memory)$/.test(
      text
    ) ||
    /^forget (?:my )?(?:history|memory)$/.test(
      text
    )
  );
}

function resolveContextTarget(
  targetText: string
): string | null {
  const words =
    targetText.split(/\s+/);

  const containsContextWord =
    words.some((word) =>
      contextWords.has(word)
    );

  if (!containsContextWord) {
    return null;
  }

  if (!lastTarget) {
    lastTarget =
      loadLastTarget();
  }

  return lastTarget;
}

function resolveLastTarget(): string | null {
  if (!lastTarget) {
    lastTarget =
      loadLastTarget();
  }

  return lastTarget;
}

function resolveLastCommand(): string | null {
  if (!lastCommand) {
    lastCommand =
      loadLastCommand();
  }

  return lastCommand;
}

function getDisplayName(
  target: string
): string {
  const displayNames: Record<
    string,
    string
  > = {
    chrome: "Chrome",
    notepad: "Notepad",
    calculator: "Calculator",
    vscode: "VS Code",
    explorer: "File Explorer",
    downloads: "Downloads",
    documents: "Documents",
  };

  return (
    displayNames[target] ?? target
  );
}

function getHistoryCount(
  text: string
): number {
  const match = text.match(
    /\blast\s+(\d+)\b/
  );

  if (!match) {
    return 3;
  }

  const requested =
    Number(match[1]);

  if (
    !Number.isFinite(requested) ||
    requested <= 0
  ) {
    return 3;
  }

  return Math.min(
    requested,
    MAX_COMMAND_HISTORY
  );
}

function formatCommandList(
  commands: string[]
): string {
  return commands
    .map(
      (command, index) =>
        `${index + 1}. ${command}`
    )
    .join(" | ");
}

function findCommandBeforeTarget(
  targetText: string
): string | null {
  const history =
    resolveCommandHistory();

  const mappedTarget =
    findTarget(targetText);

  if (!mappedTarget) {
    return null;
  }

  const targetCommand =
    history.find((command) =>
      command.endsWith(
        ` ${mappedTarget}`
      )
    );

  if (!targetCommand) {
    return null;
  }

  const targetIndex =
    history.indexOf(
      targetCommand
    );

  if (
    targetIndex === -1 ||
    targetIndex >=
      history.length - 1
  ) {
    return null;
  }

  return history[targetIndex + 1];
}

function extractBeforeTarget(
  text: string
): string | null {
  const match = text.match(
    /what did i open before (.+)$/
  );

  if (!match) {
    return null;
  }

  return match[1].trim();
}

function extractNaturalTarget(
  targetText: string
): string | null {
  let cleaned = targetText.trim();

  const words = cleaned.split(/\s+/);

  while (
    words.length > 0 &&
    conversationalWords.has(words[0])
  ) {
    words.shift();
  }

  while (
    words.length > 0 &&
    conversationalWords.has(
      words[words.length - 1]
    )
  ) {
    words.pop();
  }

  cleaned = words.join(" ");

  if (!cleaned) {
    return null;
  }

  return findTarget(cleaned);
}

async function executeTarget(
  target: string,
  originalCommand: string,
  setStatus: StatusUpdater,
  addHistory?: HistoryUpdater,
  rememberAsNewCommand = true
): Promise<boolean> {
  setStatus(
    `Opening ${target}...`
  );

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

      lastCommand =
        originalCommand;
      saveLastCommand(originalCommand);

      if (rememberAsNewCommand) {
        rememberCommand(
          originalCommand
        );
      }
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
  addHistory?: HistoryUpdater,
  clearHistory?: ClearHistoryUpdater
): Promise<boolean> {
  const text =
    cleanCommand(command);

  if (!text) {
    return false;
  }

  
  if (isMemoryResetCommand(text)) {
    clearVaaniMemory();
    clearHistory?.();

    const message =
      "Vaani memory cleared successfully.";

    setStatus(message);

    return true;
  }

  if (isRecentCommandsQuery(text)) {
    const history =
      resolveCommandHistory();

    if (history.length === 0) {
      const message =
        "I don't have any recent commands yet.";

      setStatus(message);
      addHistory?.(message);

      return false;
    }

    const count =
      getHistoryCount(text);

    const recent =
      history.slice(0, count);

    const message =
      `Your last ${recent.length} command${
        recent.length === 1
          ? ""
          : "s"
      } were: ${formatCommandList(
        recent
      )}.`;

    setStatus(message);
    addHistory?.(message);

    return true;
  }

  const beforeTarget =
    extractBeforeTarget(text);

  if (beforeTarget) {
    const previousCommand =
      findCommandBeforeTarget(
        beforeTarget
      );

    if (!previousCommand) {
      const message =
        `I don't have a previous command before ${beforeTarget}.`;

      setStatus(message);
      addHistory?.(message);

      return false;
    }

    const message =
      `Before ${beforeTarget}, you used: "${previousCommand}".`;

    setStatus(message);
    addHistory?.(message);

    return true;
  }

  if (isQueryCommand(text)) {
    const target =
      resolveLastTarget();

    const previousCommand =
      resolveLastCommand();

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
      text.includes(
        "previous command"
      ) ||
      text.includes(
        "last command"
      )
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

  if (isRepeatCommand(text)) {
    const target =
      resolveLastTarget();

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
      addHistory,
      true
    );
  }
  const words =
    text.split(/\s+/);

  const action =
    words.find((word) =>
      actionWords.has(word)
    );

  if (!action) {
    const message =
      "I don't understand that command yet.";

    setStatus(message);
    addHistory?.(message);

    return false;
  }

  const actionIndex =
    words.indexOf(action);

  const targetWords =
    words
      .slice(actionIndex + 1)
      .filter(
        (word) =>
          !conversationalWords.has(
            word
          )
      );

  const targetText =
    targetWords.join(" ");

  if (!targetText) {
    const message =
      "Please tell me what you want me to open.";

    setStatus(message);
    addHistory?.(message);

    return false;
  }

 
  let mappedTarget =
    findTarget(targetText);

  
  if (!mappedTarget) {
    mappedTarget =
      extractNaturalTarget(
        targetText
      );
  }

 
  if (!mappedTarget) {
    mappedTarget =
      resolveContextTarget(
        targetText
      );
  }

  if (!mappedTarget) {
    const contextMessage =
      contextWords.has(targetText)
        ? "I don't have a previous command to refer to."
        : `I don't know how to open "${targetText}" yet.`;

    setStatus(contextMessage);
    addHistory?.(
      contextMessage
    );

    return false;
  }

  return executeTarget(
    mappedTarget,
    text,
    setStatus,
    addHistory,
    true
  );
}

export async function processCommand(
  command: string,
  setStatus: StatusUpdater,
  addHistory?: HistoryUpdater,
  clearHistory?: ClearHistoryUpdater
) {
  const text = cleanCommand(command);

  if (!text) {
    const message =
      "Please enter a command.";

    setStatus(message);
    addHistory?.(message);

    return;
  }

  const commands = splitCommands(text);

 
  let previousAction:
    | "open"
    | "launch"
    | "start"
    | null = null;

  for (const currentCommand of commands) {
    let normalizedCommand =
      cleanCommand(currentCommand);

    const words =
      normalizedCommand.split(/\s+/);

    const hasAction = words.some(
      (word) => actionWords.has(word)
    );

    
    if (!hasAction && previousAction) {
      normalizedCommand =
        `${previousAction} ${normalizedCommand}`;
    }

    
    const normalizedWords =
      normalizedCommand.split(/\s+/);

    const currentAction =
      normalizedWords.find((word) =>
        actionWords.has(word)
      );

    if (
      currentAction === "open" ||
      currentAction === "launch" ||
      currentAction === "start"
    ) {
      previousAction = currentAction;
    }

    await executeSingleCommand(
      normalizedCommand,
      setStatus,
      addHistory,
      clearHistory
    );
  }
}