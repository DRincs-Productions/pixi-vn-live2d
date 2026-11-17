---

name: pixi-vn-live2d
description: Install and use @drincs/pixi-vn-live2d in Pixi'VN projects. Covers Cubism runtime setup, registering the render pipe, loading model sources, Live2D readiness, positioning, expressions, motions and saved state. For Live2D commands in .ink files, also read pixi-vn-live2d-ink.
---

# Pixi'VN Live2D

`@drincs/pixi-vn-live2d` integrates `untitled-pixi-live2d-engine` with Pixi'VN's
canvas and save system. Use the `Live2D` class from the root entry point for game
elements. The raw `Live2DModel` exported by `/core` does not implement this wrapper's
Pixi'VN positioning or memory integration.

For Ink commands, read [pixi-vn-live2d-ink](../ink/SKILL.md).
Use the base Pixi'VN skills when the task concerns general canvas, assets or saves.

## Install and initialize

```sh
npm install @drincs/pixi-vn-live2d untitled-pixi-live2d-engine
```

The package requires `@drincs/pixi-vn` >= 1.5.13 and an engine version compatible
with its `^1.3.5` peer range. Ink and Zod are optional for TypeScript-only usage.

Load the external Cubism runtime before the application module imports the engine:
Cubism 2 models need the legacy `live2d.min.js`, while modern models need
`live2dcubismcore.min.js`. Use the runtime matching the model's export and follow
its distribution/license requirements. The repository's `playground/index.html`
shows both script tags; an app only needs the runtimes for its models.

Import the wrapper during startup so its `RegisteredCanvasComponents` registration
exists before restoring saves. Register `Live2DPlugin` before creating the Pixi
renderer, using the same PixiJS instance as Pixi'VN:

```ts
// main.ts, after the required runtime scripts have loaded
import "@drincs/pixi-vn-live2d";
import { Game } from "@drincs/pixi-vn";
import { extensions } from "@drincs/pixi-vn/pixi.js";
import { Live2DPlugin } from "@drincs/pixi-vn-live2d/core";

extensions.add(Live2DPlugin);
await Game.init(document.body, { width: 1920, height: 1080 });
```

## Sources and readiness

`source` is required: a URL for the model settings file (`.model.json` or
`.model3.json`), or an alias registered with Pixi's `Assets`. Register the settings
URL, not an individual texture or `.moc3` file. Preserve the relative URLs to the
model's textures, motions and expressions; cross-origin hosting must permit requests.
The factory loads model resources itself; `Assets.add` only registers the alias.

```ts
import { Assets, canvas } from "@drincs/pixi-vn";
import { Live2D } from "@drincs/pixi-vn-live2d";

Assets.add({ alias: "avatarModel", src: "/models/avatar/avatar.model3.json" });

const model = new Live2D({
    source: "avatarModel",
    anchorMode: "drawable",
    xAlign: 0.5,
    yAlign: 1,
    scale: 0.3,
});
await model.ready;
canvas.add("avatar", model);
```

`new Live2D(...)` starts asynchronous loading. Container properties passed in the
constructor are applied after loading. Await `ready` before adding the model to
the stage, inspecting dimensions, or calling engine methods. Errors reject `ready`.
`await Live2D.create(options)` constructs and awaits readiness in one call.
Neither anchor mode removes the need to wait for loading.

## Positioning

The default `anchorMode` is `"canvas"`, matching the engine. `"drawable"` resolves
the anchor against drawable geometry instead of the model's internal canvas.
These modes can produce different offsets; choose explicitly when alignment must
follow the visible figure.

Use `xAlign`/`yAlign` or `align` to align through Pixi'VN, without requiring an
explicit anchor. They can be constructor options or assigned later:

```ts
model.xAlign = 0.5;
model.yAlign = 1;
// Equivalent combined assignment:
model.align = { x: 0.5, y: 1 };
```

For direct anchor positioning, use an explicit anchor and pixel position:

```ts
model.anchor.set(0.5, 1);
model.position.set(canvas.width / 2, canvas.height);
```

`percentagePosition`/`percentageX`/`percentageY` position by screen percentage;
`align` additionally accounts for the element's dimensions. Assigning `x`, `y`
or `position` switches to pixel positioning.

Some models expose canvas fallback dimensions until the first render, even after
`ready`. The wrapper schedules an alignment refresh after rendering for `align`,
`xAlign` and `yAlign`. Do not calculate a permanent position by subtracting initial
`width`/`height` from the screen size. For the wrapper's own implementation, inspect
`getSuperPivot` and `reloadAlignAfterDrawableBoundsUpdate`; the proposed upstream
`drawableBoundsUpdated` event is not a required or assumed engine API.

## Expressions, motions and interaction

```ts
const avatar = canvas.find<Live2D>("avatar");
if (avatar) {
    await avatar.expression("smile"); // expression name or numeric index
    await avatar.motion("Idle", 0); // motion group and optional index
    avatar.stopMotions();
}
```

Names and case come from the model's settings. Omitting the motion index chooses
a random motion in the group. The inherited `motion` signature accepts priority
and options such as `sound`, `volume`, `expression` and `resetExpression`.
Awaiting `motion` starts/loads the requested motion; it does not represent waiting
for the animation to finish. Inspect the installed engine types for advanced APIs
such as `parallelMotion`, `focus`, and completion callbacks.

The wrapper supports Pixi'VN listener handling through `on(...)`: the component
instance is appended to handler arguments, and an explicit listener context is
preserved. For model hit areas, use the engine's `hit` event and configured hit
testing; for Pixi pointer events, configure `eventMode` as appropriate.

## Saved state and verification

`Live2D` provides `Live2DMemory`, including its source, container/positioning state,
current expression and motion state. Keep model source aliases resolvable when a
save is restored, and import the root package before restoration. Let Pixi'VN
export/restore canvas state rather than serializing the raw runtime object.
Callbacks and ticker objects are not serializable factory options.

For browser issues, inspect missing runtime globals, resource requests and console
errors before adjusting layout. The development playground's `base` and
`alignment-tests` labels cover positioning in a real renderer. See the project's
AGENTS.md and package scripts for local verification commands. Browser automation
can use Pixi'VN's testing bridge only if the installed Pixi'VN version supports it.
