import { describe, expect, it } from 'vitest';
import { toDragTilt } from './toDragTilt.ts';

const rect = { width: 200, height: 300 };
const start = { clientX: 150, clientY: 400 };

describe('util: toDragTilt', () => {
  it('should be neutral where the finger went down', () => {
    expect(toDragTilt({ start, current: start, rect })).toEqual({ x: 0, y: 0 });
  });

  it('should follow the finger to the right and downwards', () => {
    expect(
      toDragTilt({ start, current: { clientX: 200, clientY: 475 }, rect }),
    ).toEqual({ x: 0.5, y: 0.5 });
  });

  it('should follow the finger to the left and upwards', () => {
    expect(
      toDragTilt({ start, current: { clientX: 100, clientY: 325 }, rect }),
    ).toEqual({ x: -0.5, y: -0.5 });
  });

  it('should reach full tilt after half the poster', () => {
    expect(
      toDragTilt({ start, current: { clientX: 250, clientY: 400 }, rect }),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should clamp a drag longer than the poster', () => {
    expect(
      toDragTilt({ start, current: { clientX: -900, clientY: 900 }, rect }),
    ).toEqual({ x: -1, y: 1 });
  });

  it('should not divide by an empty box', () => {
    expect(
      toDragTilt({
        start,
        current: { clientX: 1, clientY: 1 },
        rect: { width: 0, height: 0 },
      }),
    ).toEqual({ x: 0, y: 0 });
  });
});
