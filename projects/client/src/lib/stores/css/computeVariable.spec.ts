import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computeVariable } from './computeVariable';

describe('computeVariable', () => {
  beforeEach(() => {
    // Mock document.documentElement and getComputedStyle
    const documentElement = {
      style: {
        getPropertyValue: vi.fn(),
      },
    };

    global.document = {
      documentElement,
    } as unknown as Document;

    global.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('test-value'),
    });
  });

  it('should return computed CSS variable value', () => {
    expect(computeVariable('--test-var')).toBe('test-value');
  });
});
