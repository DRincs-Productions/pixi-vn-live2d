import { canvas, narration, newLabel } from "@drincs/pixi-vn";
import { Live2D } from "@drincs/pixi-vn-live2d";

const cubism2Model =
  "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json";
const cubism4Model =
  "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json";

interface AddLive2DProps {
  alias: string;
  source: string;
}

const addLive2DLabel = newLabel<AddLive2DProps>("addLive2DLabel", [
  async ({ alias, source }) => {
    const live2d = await Live2D.create({ source });
    live2d.anchor.set(0.5, 1);
    live2d.position.set(canvas.width / 2, canvas.height);
    canvas.add(alias, live2d);
  },
]);

export default function App() {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        display: "flex",
        gap: 8,
        pointerEvents: "auto",
      }}
    >
      <button
        onClick={() =>
          narration.call(addLive2DLabel, { alias: "shizuku", source: cubism2Model })
        }
      >
        Add Shizuku (Cubism 2)
      </button>
      <button
        onClick={() =>
          narration.call(addLive2DLabel, { alias: "haru", source: cubism4Model })
        }
      >
        Add Haru (Cubism 4)
      </button>
    </div>
  );
}
