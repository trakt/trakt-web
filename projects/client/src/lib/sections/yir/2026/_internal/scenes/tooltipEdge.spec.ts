import { describe, expect, it } from 'vitest';
import { tooltipEdge } from './tooltipEdge.ts';

describe('util: tooltipEdge', () => {
  it('should anchor the first bars to the start', () => {
    expect(tooltipEdge(0, 53)).toBe('start');
    expect(tooltipEdge(6, 53)).toBe('start');
  });

  it('should centre bars in the middle', () => {
    expect(tooltipEdge(26, 53)).toBe('middle');
  });

  it('should anchor the last bars to the end', () => {
    expect(tooltipEdge(52, 53)).toBe('end');
  });

  it('should keep a lone bar centred', () => {
    expect(tooltipEdge(0, 1)).toBe('middle');
  });
});
