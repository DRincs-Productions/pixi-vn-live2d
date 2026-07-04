# Live2D integration for Pixi’VN

`@drincs/pixi-vn-live2d` is a lightweight wrapper around [`untitled-pixi-live2d-engine`](https://github.com/Untitled-Story/untitled-pixi-live2d-engine), designed specifically to integrate **Live2D** models into **Pixi’VN** projects.

The library provides Pixi’VN-friendly abstractions for using Live2D models inside visual novels, making it easier to load, manage, and display Live2D content within the Pixi’VN ecosystem.

## Example

```ts
import { canvas } from "@drincs/pixi-vn";
import { extensions } from "pixi.js";
import { Live2DPlugin } from "@drincs/pixi-vn-live2d/core";
import { Live2D } from "@drincs/pixi-vn-live2d";

// Register the Live2D render pipe before creating the Pixi'VN canvas application
extensions.add(Live2DPlugin);

const live2d = await Live2D.from({ source: "https://example.com/model/model3.json" });
live2d.anchor.set(0.5);
live2d.x = canvas.width / 2;
live2d.y = canvas.height;

live2d.motion("Idle");

canvas.add("live2d", live2d);
```

## Build

To build the library, run the following command:

```bash
npm run build
```
