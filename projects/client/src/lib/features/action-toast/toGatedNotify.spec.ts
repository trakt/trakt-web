import { describe, expect, it, vi } from 'vitest';
import { toGatedNotify } from './toGatedNotify.ts';

describe('util: toGatedNotify', () => {
  it('should forward the toast when enabled', () => {
    const notify = vi.fn();

    toGatedNotify(notify, true)({ message: 'hello' });

    expect(notify).toHaveBeenCalledWith({ message: 'hello' });
  });

  it('should swallow the toast when disabled', () => {
    const notify = vi.fn();

    toGatedNotify(notify, false)({ message: 'hello' });

    expect(notify).not.toHaveBeenCalled();
  });
});
