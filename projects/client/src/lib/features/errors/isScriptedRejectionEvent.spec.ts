import { describe, expect, it } from 'vitest';
import { isScriptedRejectionEvent } from './isScriptedRejectionEvent.ts';

describe('util: isScriptedRejectionEvent', () => {
  it('should match a rejection a script reports as a custom event', () => {
    const event = new CustomEvent('unhandledrejection', {
      detail: { reason: {}, promise: null },
    });

    expect(isScriptedRejectionEvent(event)).toBe(true);
  });

  it('should match a custom event without detail', () => {
    expect(
      isScriptedRejectionEvent(new CustomEvent('unhandledrejection')),
    ).toBe(true);
  });

  it('should keep a plain rejection event from a promise polyfill', () => {
    expect(isScriptedRejectionEvent(new Event('unhandledrejection'))).toBe(
      false,
    );
  });
});
