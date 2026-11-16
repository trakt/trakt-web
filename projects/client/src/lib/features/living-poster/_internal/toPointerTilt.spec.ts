import { describe, expect, it } from 'vitest';
import { toPointerTilt } from './toPointerTilt.ts';

const rect = { left: 100, top: 50, width: 200, height: 300 };

describe('util: toPointerTilt', () => {
  it('should be centered in the middle of the poster', () => {
    expect(
      toPointerTilt({ pointer: { clientX: 200, clientY: 200 }, rect }),
    ).toEqual({ x: 0, y: 0 });
  });

  it('should reach the edges at plus and minus one', () => {
    expect(
      toPointerTilt({ pointer: { clientX: 100, clientY: 350 }, rect }),
    ).toEqual({ x: -1, y: 1 });
  });

  it('should clamp a pointer outside the poster', () => {
    expect(
      toPointerTilt({ pointer: { clientX: 900, clientY: -900 }, rect }),
    ).toEqual({ x: 1, y: -1 });
  });

  it('should not divide by an empty box', () => {
    expect(
      toPointerTilt({
        pointer: { clientX: 1, clientY: 1 },
        rect: { left: 0, top: 0, width: 0, height: 0 },
      }),
    ).toEqual({ x: 0, y: 0 });
  });
});
