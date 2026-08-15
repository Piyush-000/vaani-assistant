"use client";

import { useRef, useState } from "react";

type Props = {
  onCommand: (command: string) => void;
  onStatusChange?: (message: string) => void;
};

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function VoiceButton({
  onCommand,
  onStatusChange,
}: Props) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  function startListening() {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onStatusChange?.(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      onStatusChange?.("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript.trim();

      if (transcript) {
        onStatusChange?.(`Heard: "${transcript}"`);
        onCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        onStatusChange?.(
          "Microphone permission was denied."
        );
      } else {
        onStatusChange?.(
          `Speech recognition error: ${event.error}`
        );
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setListening(false);
      onStatusChange?.("Unable to start microphone.");
    }
  }

  return (
    <button
      type="button"
      onClick={startListening}
      className={`w-full rounded-xl border px-6 py-4 text-lg font-semibold transition-all duration-300 ${
        listening
          ? "animate-pulse border-red-500 bg-red-600 text-white"
          : "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
      }`}
    >
      {listening ? "🎙️ Listening..." : "🎤 Speak"}
    </button>
  );
}