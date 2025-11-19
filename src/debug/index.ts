import { setupConsoleSonifier } from "./consoleSonifier";
import { createDebugPanel, type DebugToneSample } from "./panel";

const isDev = typeof import.meta !== "undefined" && Boolean(import.meta.env?.DEV);

export type DebugTools = {
  logToneSample: (sample: DebugToneSample) => void;
};

const noopTools: DebugTools = {
  logToneSample: () => {},
};

export const setupDebugTools = (): DebugTools => {
  if (!isDev || typeof window === "undefined" || typeof document === "undefined") {
    return noopTools;
  }

  const panel = createDebugPanel();
  setupConsoleSonifier();

  return {
    logToneSample: panel.logSample,
  };
};
