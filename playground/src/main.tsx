import { Container, Game, canvas, sound } from "@drincs/pixi-vn";
import { Live2DPlugin } from "@drincs/pixi-vn-live2d/core";
import { extensions } from "@drincs/pixi-vn/pixi.js";
import { createRoot } from "react-dom/client";
import App from "./App";

// Register the Live2D render pipe before creating the Pixi'VN canvas application
extensions.add(Live2DPlugin);

// Canvas setup with PIXI
const body = document.body;
if (!body) {
  throw new Error("body element not found");
}

Game.init(body, {
  height: 1080,
  width: 1920,
}).then(() => {
  // Pixi.JS UI Layer
  canvas.addLayer("ui", new Container());

  // Sound setup
  sound.addChannel("bgm", { background: true });
  sound.addChannel("sfx");
  sound.defaultChannelAlias = "sfx";

  // React setup with ReactDOM
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("root element not found");
  }

  const htmlLayout = canvas.addHtmlLayer("ui", root);
  if (!htmlLayout) {
    throw new Error("htmlLayout not found");
  }
  const reactRoot = createRoot(htmlLayout);

  reactRoot.render(<App />);
});
