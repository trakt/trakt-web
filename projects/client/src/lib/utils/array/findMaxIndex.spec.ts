import { describe, expect, it } from "vitest";
import { findMaxIndex } from "./findMaxIndex";

describe("findMaxIndex", () => {
  it("returns index of maximum value", () => {
    const values = [1, 5, 3, 9, 2];
    expect(findMaxIndex(values)).toBe(3);
  });

  it("returns first index when multiple max values exist", () => {
    const values = [1, 9, 3, 9, 2];
    expect(findMaxIndex(values)).toBe(1);
  });

  it("handles single element array", () => {
    expect(findMaxIndex([42])).toBe(0);
  });

  it("handles negative numbers", () => {
    const values = [-5, -2, -10, -1];
    expect(findMaxIndex(values)).toBe(3);
  });

  it("handles all same values", () => {
    const values = [5, 5, 5, 5];
    expect(findMaxIndex(values)).toBe(0);
  });

  it("handles max at beginning", () => {
    const values = [100, 50, 25, 10];
    expect(findMaxIndex(values)).toBe(0);
  });

  it("handles max at end", () => {
    const values = [10, 25, 50, 100];
    expect(findMaxIndex(values)).toBe(3);
  });

  it("handles decimal values", () => {
    const values = [1.1, 2.5, 1.9, 2.4];
    expect(findMaxIndex(values)).toBe(1);
  });

  it("handles zero and positive numbers", () => {
    const values = [0, 1, 2, 3];
    expect(findMaxIndex(values)).toBe(3);
  });

  it("returns -1 for empty array", () => {
    expect(findMaxIndex([])).toBe(-1);
  });
});
