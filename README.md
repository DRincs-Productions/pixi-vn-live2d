# Live2D integration for Pixi’VN

![pixi-vn-cover](https://github.com/user-attachments/assets/5ff318a6-51ac-47a4-a5d2-fac53edc9614)

<p align="center">
  <a href="https://www.npmjs.com/package/@drincs/pixi-vn-live2d" rel="noopener noreferrer nofollow"><img src="https://img.shields.io/npm/v/@drincs/pixi-vn-live2d?label=version" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@drincs/pixi-vn-live2d" rel="noopener noreferrer nofollow"><img src="https://img.shields.io/npm/dm/@drincs/pixi-vn-live2d" alt="npm downloads per month"></a>
  <a target="_blank" href="https://www.jsdelivr.com/package/npm/@drincs/pixi-vn-live2d" rel="noopener noreferrer nofollow"><img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/hm/@drincs/pixi-vn-live2d?logo=jsdeliver"></a>
  <a href="https://www.npmjs.com/package/@drincs/pixi-vn-live2d" rel="noopener noreferrer nofollow"><img alt="NPM License" src="https://img.shields.io/npm/l/@drincs/pixi-vn-live2d"></a>
  <a target="_blank" href="https://discord.gg/E95FZWakzp" rel="noopener noreferrer nofollow"><img alt="Discord" src="https://img.shields.io/discord/1263071210011496501?color=7289da&label=discord"></a>
</p>

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
