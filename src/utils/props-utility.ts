import type Live2D from "@/components/Live2D";
import { CanvasPropertyUtility as PropsUtils } from "@drincs/pixi-vn";

/**
 * Unlike native PIXI containers/sprites (where `anchor`, when present, is independent of
 * `pivot`), `untitled-pixi-live2d-engine`'s `Live2DModel` bakes `anchor` directly into `pivot`
 * by its own `onAnchorChange`; the pivot is based on internal model dimensions in `canvas` mode
 * and drawable bounds in `drawable` mode. Pixi'VN's align/percentagePosition math already
 * re-applies `anchor` as its own term, so that baked-in pivot offset is subtracted here first;
 * otherwise it gets counted twice and the element ends up further off than `align` alone would
 * put it.
 */
export function getSuperPivot(live2d: Live2D) {
    const internalWidth = live2d.internalModel?.width ?? 0;
    const internalHeight = live2d.internalModel?.height ?? 0;
    let anchorPivot: { x: number; y: number };
    switch (live2d.anchorMode) {
        case "drawable":
            anchorPivot = {
                x: live2d.bounds.minX + live2d.anchor.x * live2d.bounds.width,
                y: live2d.bounds.minY + live2d.anchor.y * live2d.bounds.height,
            };
            break;
        case "canvas":
        default:
            anchorPivot = {
                x: live2d.anchor.x * internalWidth,
                y: live2d.anchor.y * internalHeight,
            };
            break;
    }
    const rawPivot = {
        x: live2d.pivot.x - anchorPivot.x,
        y: live2d.pivot.y - anchorPivot.y,
    };
    return PropsUtils.getSuperPoint(rawPivot, live2d.angle);
}
