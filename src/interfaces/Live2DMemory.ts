import type MotionMemory from "@/interfaces/MotionMemory";
import type Live2DOptions from "@/interfaces/Live2DOptions";
import type {
    AdditionalPositionsExtensionProps,
    CanvasBaseItemMemory,
    ListenerExtensionMemory,
} from "@drincs/pixi-vn";

interface MemoryCore
    extends Omit<
        Live2DOptions,
        | "source"
        | "onLoad"
        | "onError"
        | "ticker"
        | "boundsArea"
        | "cacheAsTexture"
        | "cullArea"
        | "hitArea"
        | "mask"
        | "onclick"
        | "onglobalmousemove"
        | "onglobalpointermove"
        | "onmousemove"
        | "onpointermove"
        | "onglobaltouchmove"
        | "ontouchmove"
        | "onmousedown"
        | "onmouseenter"
        | "onmouseleave"
        | "onmouseout"
        | "onmouseover"
        | "onmouseup"
        | "onmouseupoutside"
        | "onpointercancel"
        | "onpointerenter"
        | "onpointerdown"
        | "onpointerleave"
        | "onpointerout"
        | "onpointerover"
        | "onpointertap"
        | "onpointerup"
        | "onrightdown"
        | "onrightup"
        | "ontouchcancel"
        | "onRender"
        | "onpointerupoutside"
        | "onrightclick"
        | "onrightupoutside"
        | "ontap"
        | "ontouchendoutside"
        | "ontouchend"
        | "ontouchstart"
        | "onwheel"
        | "children"
        | "filters"
        | "parent"
    > {}
export default interface Live2DMemory
    extends MemoryCore,
        CanvasBaseItemMemory,
        ListenerExtensionMemory,
        AdditionalPositionsExtensionProps {
    /**
     * The model source. Must be a URL/alias string so it can be reloaded when the memory is restored.
     */
    source: string;
    anchor?: { x: number; y: number };
    /**
     * The focus position of the model, in world space.
     */
    focus?: { x: number; y: number };
    /**
     * The motion currently playing on the main motion manager.
     */
    currentMotion?: MotionMemory;
    /**
     * The motions currently playing on each parallel motion manager.
     */
    parallelMotions: (MotionMemory | null)[];
    /**
     * The id (index or name) of the expression currently applied to the model.
     */
    currentExpressionId?: number | string;
}
