export type DebugToneSample = {
  toneId: string;
  frequency: number;
  volume: number;
  hueByte: number;
  valueByte: number;
};

export type PanelLogger = {
  logSamples: (samples: DebugToneSample[]) => void;
};

export const createDebugPanel = (): PanelLogger => {
  const panel = ensurePanel();
  const toneSamples = new Map<string, DebugToneSample>();

  const render = () => {
    const lines = Array.from(toneSamples.values()).map((sample) => {
      const freq = `${sample.frequency.toFixed(1)} Hz`;
      const vol = sample.volume.toFixed(2);
      const hue = sample.hueByte.toString().padStart(3, " ");
      const value = sample.valueByte.toString().padStart(3, " ");
      return `${sample.toneId}: ${freq} | vol ${vol} | hue ${hue} | value ${value}`;
    });

    panel.textContent = lines.length > 0 ? lines.join("\n") : "No tone samples yet.";
  };

  return {
    logSamples: (samples) => {
      const seen = new Set<string>();
      for (const sample of samples) {
        toneSamples.set(sample.toneId, sample);
        seen.add(sample.toneId);
      }

      for (const toneId of toneSamples.keys()) {
        if (!seen.has(toneId)) {
          toneSamples.delete(toneId);
        }
      }

      render();
    },
  };
};

const ensurePanel = () => {
  const existing = document.getElementById("herakoi-debug-panel");
  if (existing instanceof HTMLPreElement) {
    applyPanelStyles(existing);
    return existing;
  }

  const panel = document.createElement("pre");
  panel.id = "herakoi-debug-panel";
  applyPanelStyles(panel);
  panel.textContent = "Debug panel ready.";

  document.body.append(panel);
  return panel;
};

/*
 * We restyle the HUD every time so teammates always get the same roomy, monospaced panel that avoids tiny text
 * and stray scrollbars. It sits off to the bottom-right with viewport-based sizing, leaving enough padding
 * for long sample lines while pointer events stay disabled to keep the camera UI clickable.
 */
const applyPanelStyles = (panel: HTMLPreElement) => {
  panel.style.position = "fixed";
  panel.style.bottom = "16px";
  panel.style.right = "16px";
  panel.style.width = "min(420px, 40vw)";
  panel.style.maxWidth = "min(420px, 40vw)";
  panel.style.maxHeight = "min(320px, 50vh)";
  panel.style.overflowY = "auto";
  panel.style.overflowX = "hidden";
  panel.style.padding = "12px 16px";
  panel.style.margin = "0";
  panel.style.background = "rgba(0, 0, 0, 0.75)";
  panel.style.color = "#32cd32";
  panel.style.fontFamily = "ui-monospace, SFMono-Regular, Consolas, Menlo, monospace";
  panel.style.fontSize = "12px";
  panel.style.lineHeight = "1.2";
  panel.style.whiteSpace = "pre";
  panel.style.wordBreak = "normal";
  panel.style.zIndex = "9999";
  panel.style.pointerEvents = "none";
};
