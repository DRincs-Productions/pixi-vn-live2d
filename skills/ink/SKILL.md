---

name: pixi-vn-live2d-ink
description: Show, edit and remove Live2D models, change expressions and play or stop motions from Pixi'VN .ink scripts. Covers createLive2DHandler from @drincs/pixi-vn-live2d/ink, source aliases, command syntax and transitions. Read pixi-vn-live2d for runtime setup and the TypeScript component.
---

# Live2D in Ink

Use [pixi-vn-live2d](../getting-started/SKILL.md) for Cubism scripts, render-pipe
registration, model sources and readiness. Those requirements also apply to Ink.

## Register the commands

Install `@drincs/pixi-vn-ink` and `zod` when using this entry point. Call
`createLive2DHandler()` once before parsing Ink, next to the app's base command setup:

```ts
import { addBaseHashtagCommands } from "@drincs/pixi-vn-ink";
import { createLive2DHandler } from "@drincs/pixi-vn-live2d/ink";

addBaseHashtagCommands(); // preserve any existing project-specific options
createLive2DHandler();
```

The root package still needs to be imported during startup so saved Live2D
components can be restored. Importing `/ink` does not replace renderer setup.

## Show a model

```ink
# show live2d <alias> [<key> <value> …] [with <transition> [<key> <value> …]]
# show live2d <alias> <source> [<key> <value> …] [with <transition> [<key> <value> …]]
```

`alias` is the canvas key. Without an explicit source, it also identifies the model
settings URL/asset alias. With a source, the canvas key can differ, so one model
can appear under multiple keys. Register asset sources in application setup first:

```ts
Assets.add({ alias: "avatarModel", src: "/models/avatar/avatar.model3.json" });
```

```ink
# show live2d avatar avatarModel anchorMode drawable xAlign 0.5 yAlign 1 scale 0.3 with dissolve duration 0.5
```

Properties are key/value tokens converted by the Ink command system and forwarded
to `Live2DOptions`. `source` is positional here, not a `source <value>` property.
The token after the canvas alias is treated as a property when it matches a known
option, or as the transition keyword when it is `with`; otherwise it is the
explicit source. Avoid source aliases that collide with option names or `with`.

The show handler awaits `ready` before adding the element or starting its entrance
transition. No extra Ink command is needed to await model loading. Prefer the
wrapper's alignment properties over positions derived from initial dimensions.

Entrance transitions are provided through `@drincs/pixi-vn-json/actions`:
`dissolve`, `fade`, `movein`, `zoomin`, `pushin` (check the installed helper's
`ENTRANCE_TRANSITION_TYPES` for its supported set). Transition properties follow
`with <transition>`, separate from construction properties.

## Edit and remove

```ink
# edit live2d avatar xAlign 0.8 alpha 0.9
# remove live2d avatar with dissolve duration 0.5
```

`edit` assigns properties to an existing instance; it does not reconstruct the
model. Use it for mutable container properties, not to reload `source` or change
the constructor-only `anchorMode`.

`remove` accepts no transition (immediate removal), or an exit transition:
`dissolve`, `fade`, `moveout`, `zoomout`, `pushout`. Its handler starts the exit
transition without awaiting completion. Use the project's established Ink pause
conventions if narration must hold at that point.

## Expressions and motions

```ink
# change expression smile on live2d avatar
# change expression 0 on live2d avatar
# play motion Idle on live2d avatar index 0 priority 3
# stop motions on live2d avatar
```

Expression IDs can be names or integer indices. The expression and motion handlers
await their engine calls, which does not mean waiting for an entire animation to
finish. Motion groups and expression names are model-specific and case-sensitive.

The motion tail accepts `index`, `priority`, `sound`, `volume`, `expression` and
`resetExpression`. Without `index`, a random motion in that group is selected.
`stop motions` calls `stopMotions()`, including the engine's motion/lipsync stopping
behavior. There are no built-in Live2D Ink commands for parallel motions or focus;
use a custom hashtag handler calling the TypeScript API when those are needed.

## Full sequence

Given a registered `avatarModel` source and model-defined `smile`/`Idle` entries:

```ink
=== introduction ===
# show live2d avatar avatarModel anchorMode drawable xAlign 0.5 yAlign 1 scale 0.3 with fade duration 0.5
Hello!
# change expression smile on live2d avatar
# play motion Idle on live2d avatar index 0
# edit live2d avatar xAlign 0.7
See you later.
# stop motions on live2d avatar
# remove live2d avatar with dissolve duration 0.5
-> DONE
```

## Parsing and diagnostics

`parseShowLive2DTail(tail)` is exported from `/ink`. Pass the tokens after the
alias/source have been resolved; it returns `propsList`, `transitionType` and
`transitionPropsList`. It does not resolve a source or execute a transition.

Commands register validation and key schemas with `HashtagCommands`. Construction
keys come from `src/ink/live2d-options-schema.generated.ts`; edit keys use the
container schema. If option types change while developing the extension,
regenerate the construction schema with `npm run generate-live2d-options-schema`.

Unknown commands usually indicate missing handler registration. Missing canvas
aliases are logged and treated as handled commands; they do not create a model.
Check browser console/network errors for missing Cubism runtimes or model assets.
