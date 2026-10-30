import { describe, expect, it, vi } from 'vitest';
import { ignoreScriptedRejectionCalls } from './ignoreScriptedRejectionCalls.ts';

function createTarget() {
  const handler = vi.fn();
  const target: Pick<WindowEventHandlers, 'onunhandledrejection'> = {
    onunhandledrejection: handler,
  };

  ignoreScriptedRejectionCalls(target);

  return { target, handler };
}

function callHandler(
  target: Pick<WindowEventHandlers, 'onunhandledrejection'>,
  ...args: ReadonlyArray<unknown>
) {
  Reflect.apply(target.onunhandledrejection ?? (() => {}), window, args);
}

describe('util: ignoreScriptedRejectionCalls', () => {
  it('should skip a script calling the handler with a bare reason', () => {
    const { target, handler } = createTarget();

    callHandler(target, {}, Promise.resolve());

    expect(handler).not.toHaveBeenCalled();
  });

  it('should forward a rejection event to the handler', () => {
    const { target, handler } = createTarget();
    const event = new Event('unhandledrejection');

    callHandler(target, event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should leave a target without a handler untouched', () => {
    const target: Pick<WindowEventHandlers, 'onunhandledrejection'> = {
      onunhandledrejection: null,
    };

    ignoreScriptedRejectionCalls(target);

    expect(target.onunhandledrejection).toBeNull();
  });
});
