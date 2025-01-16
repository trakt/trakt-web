import { describe, expect, it, vi } from 'vitest';
import { attachRemoveWarning } from './attachRemoveWarning';

describe('attachRemoveWarning', () => {
  it('should call handler when confirmed', () => {
    const handler = vi.fn();
    const message = 'Are you sure?';
    const wrappedHandler = attachRemoveWarning(handler, message);

    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    wrappedHandler();

    expect(window.confirm).toHaveBeenCalledWith(message);
    expect(handler).toHaveBeenCalled();
  });

  it('should not call handler when canceled', () => {
    const handler = vi.fn();
    const message = 'Are you sure?';
    const wrappedHandler = attachRemoveWarning(handler, message);

    vi.spyOn(window, 'confirm').mockImplementation(() => false);

    wrappedHandler();

    expect(window.confirm).toHaveBeenCalledWith(message);
    expect(handler).not.toHaveBeenCalled();
  });
});
