// @vitest-environment node

import { expect, test } from "vitest";

test("registers Live2D Ink commands without a browser runtime", async () => {
    expect(typeof window).toBe("undefined");
    const { createLive2DHandler } = await import("@/ink");
    expect(() => createLive2DHandler()).not.toThrow();
});
