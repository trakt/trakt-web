import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computeVariable } from './computeVariable.ts';

describe('computeVariable', () => {
  beforeEach(() => {
    // Mock document.documentElement and getComputedStyle
    const documentElement = {
      style: {
        getPropertyValue: vi.fn(),
      },
    };

    vi.stubGlobal('document', { documentElement });
    vi.stubGlobal(
      'getComputedStyle',
      vi.fn().mockReturnValue({
        getPropertyValue: vi.fn().mockReturnValue('test-value'),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return computed CSS variable value', () => {
    expect(computeVariable('--test-var')).toBe('test-value');
  });
});
