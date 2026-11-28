import { describe, expect, it } from 'vitest';
import { toSvgCursor } from './toSvgCursor.ts';

describe('util: toSvgCursor', () => {
  it('should encode the svg and set the hotspot on both axes', () => {
    expect(toSvgCursor({ svg: '<svg a="1"/>', hotspot: 7 })).toBe(
      'url("data:image/svg+xml,%3Csvg%20a%3D%221%22%2F%3E") 7 7',
    );
  });
});
