import { describe, expect, it } from 'vitest';
import { sceneProgress } from './sceneProgress.ts';

const scene = { sceneTop: 1000, sceneHeight: 1700, viewportHeight: 1000 };

describe('util: sceneProgress', () => {
  it('should be 0 well before the scene reaches the viewport', () => {
    expect(sceneProgress({ ...scene, scrollTop: 0 })).toBe(0);
  });

  it('should start while the scene is still entering', () => {
    expect(sceneProgress({ ...scene, scrollTop: 600 })).toBeGreaterThan(0);
  });

  it('should reach 1 before the scene is fully scrolled past', () => {
    expect(sceneProgress({ ...scene, scrollTop: 1700 })).toBe(1);
  });

  it('should grow monotonically', () => {
    const values = [400, 600, 800, 1000, 1200, 1400].map((scrollTop) =>
      sceneProgress({ ...scene, scrollTop })
    );

    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it('should only move while pinned when pinned only', () => {
    const at = (scrollTop: number) =>
      sceneProgress({ ...scene, scrollTop, isPinnedOnly: true });

    expect(at(900)).toBe(0);
    expect(at(1350)).toBeCloseTo(0.5);
    expect(at(1700)).toBe(1);
  });

  it('should not divide by zero for a scene as tall as the viewport', () => {
    expect(
      sceneProgress({
        scrollTop: 1000,
        sceneTop: 1000,
        sceneHeight: 1000,
        viewportHeight: 1000,
        isPinnedOnly: true,
      }),
    ).toBe(0);
  });
});
