import type Live2D from "@/components/Live2D";
import { CanvasPropertyUtility as PropsUtils } from "@drincs/pixi-vn";

export function getSuperPivot(live2d: Live2D) {
    const pivot = PropsUtils.getSuperPoint(live2d.pivot, live2d.angle);
    return {
        x: pivot.x + live2d.width / 2,
        y: pivot.y + live2d.height,
    };
}
