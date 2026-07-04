import type { MotionPriority } from "@drincs/pixi-vn-live2d/core";

export default interface MotionMemory {
    /**
     * The motion group.
     */
    group: string;
    /**
     * The index of the motion in its group.
     */
    index: number;
    /**
     * The priority the motion was started with.
     */
    priority: MotionPriority;
}
