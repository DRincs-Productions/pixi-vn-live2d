import { canvas, Game, narration, stepHistory } from "@drincs/pixi-vn";
import { Live2D } from "@drincs/pixi-vn-live2d";
import { useEffect, useState } from "react";
import Live2DControls from "./Live2DControls";
import {
  alignmentTestsLabel,
  baseLabel,
  expressionLabel,
  interactiveLabel,
  motionLabel,
} from "./labels";

const LABELS = [
  alignmentTestsLabel,
  baseLabel,
  motionLabel,
  expressionLabel,
  interactiveLabel,
];

const ALIGNMENT_TEST_CASES = [
  "Constructor options: drawable + xAlign/yAlign",
  "Assign element.xAlign and element.yAlign after adding it",
  "Assign element.align after adding it",
  "Explicit drawable anchor and position (working reference)",
  "Constructor options: canvas + xAlign/yAlign",
  "Assign element.xAlign and element.yAlign with canvas mode",
];

export default function App() {
  const [running, setRunning] = useState(false);
  const [activeLabelId, setActiveLabelId] = useState<string>();
  const [alignmentTestStep, setAlignmentTestStep] = useState(0);
  const [, forceUpdate] = useState(0);
  const [lastHit, setLastHit] = useState<string[]>([]);

  useEffect(() => {
    Game.onEnd(() => {
      canvas.clear();
      setRunning(false);
      setActiveLabelId(undefined);
      setAlignmentTestStep(0);
      setLastHit([]);
    });
  }, []);

  const live2d = canvas.find<Live2D>("live2d");

  useEffect(() => {
    if (!live2d) return;
    const handler = (...args: unknown[]) => setLastHit(args[0] as string[]);
    live2d.on("hit", handler);
    return () => {
      live2d.off("hit", handler);
    };
  }, [live2d]);

  async function selectLabel(label: (typeof LABELS)[number]) {
    setRunning(true);
    setActiveLabelId(label.id);
    setAlignmentTestStep(0);
    await Game.start(label, {});
    forceUpdate((n) => n + 1);
  }

  async function handleContinue() {
    await narration.continue({});
    if (activeLabelId === "alignment-tests") {
      setAlignmentTestStep((step) => Math.min(step + 1, ALIGNMENT_TEST_CASES.length - 1));
    }
    forceUpdate((n) => n + 1);
  }

  async function handleBack() {
    await stepHistory.back({});
    if (activeLabelId === "alignment-tests") {
      setAlignmentTestStep((step) => Math.max(step - 1, 0));
    }
    forceUpdate((n) => n + 1);
  }

  if (running) {
    return (
      <div>
        <button style={{ pointerEvents: "auto" }} onClick={handleContinue}>
          Continue
        </button>
        <button
          style={{ pointerEvents: "auto" }}
          onClick={handleBack}
          disabled={!stepHistory.canGoBack}
        >
          Back
        </button>
        {activeLabelId === "alignment-tests" && (
          <p>
            Test {alignmentTestStep + 1}/{ALIGNMENT_TEST_CASES.length}: {ALIGNMENT_TEST_CASES[alignmentTestStep]}
          </p>
        )}
        {live2d && (
          <Live2DControls
            live2d={live2d}
            lastHit={lastHit}
            onChange={() => forceUpdate((n) => n + 1)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      {LABELS.map((label) => (
        <button
          style={{ pointerEvents: "auto" }}
          key={label.id}
          onClick={() => selectLabel(label)}
        >
          {label.id}
        </button>
      ))}
    </div>
  );
}
