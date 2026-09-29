import { describe, expect, it } from 'vitest';
import { radarPolygon } from './radarPolygon.ts';

describe('util: radarPolygon', () => {
  it('should emit one point per radius', () => {
    expect(radarPolygon([40, 40, 40, 40]).split(' ')).toHaveLength(4);
  });

  it('should round to one decimal', () => {
    expect(radarPolygon([40, 40, 40, 40])).toBe(
      '50.0,10.0 90.0,50.0 50.0,90.0 10.0,50.0',
    );
  });

  it('should return an empty string without radii', () => {
    expect(radarPolygon([])).toBe('');
  });
});
