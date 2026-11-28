import { describe, expect, it, vi } from 'vitest';
import { detachAll } from './detachAll.ts';

describe('util: detachAll', () => {
  it('should call every detacher once', () => {
    const first = vi.fn();
    const second = vi.fn();

    detachAll([first, second])();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('should skip detachers that attached nothing', () => {
    const detach = vi.fn();

    expect(() => detachAll([undefined, detach])()).not.toThrow();
    expect(detach).toHaveBeenCalledTimes(1);
  });
});
