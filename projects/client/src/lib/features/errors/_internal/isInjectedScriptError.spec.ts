import { describe, expect, it } from 'vitest';
import { isInjectedScriptError } from './isInjectedScriptError.ts';

function errorWithStack(stack: string | undefined): Error {
  const error = new Error('null is not an object');
  error.stack = stack;
  return error;
}

describe('util: isInjectedScriptError', () => {
  it('should match a WKWebView-injected script error attributed to the document URL', () => {
    const error = errorWithStack(
      'global code@https://app.trakt.tv/users/hank_/year/2026:1:42',
    );

    expect(isInjectedScriptError(error)).toBe(true);
  });

  it('should not match app errors originating from bundled scripts', () => {
    const error = errorWithStack(
      [
        'someFunction@https://app.trakt.tv/_app/immutable/chunks/entry.abc123.js:1:100',
        'global code@https://app.trakt.tv/_app/immutable/entry/start.def456.js:1:1',
      ].join('\n'),
    );

    expect(isInjectedScriptError(error)).toBe(false);
  });

  it('should not match app errors originating from dev-served source files', () => {
    const error = errorWithStack(
      [
        'someFunction@https://app.trakt.tv/src/lib/features/errors/ErrorProvider.svelte:52:10',
        'global code@https://app.trakt.tv/src/lib/features/errors/_internal/errorExemptions.ts:35:10',
      ].join('\n'),
    );

    expect(isInjectedScriptError(error)).toBe(false);
  });

  it('should not match Chromium-style stacks without a global code frame', () => {
    const error = errorWithStack(
      [
        "TypeError: Cannot read properties of null (reading 'scrollIntoView')",
        '    at <anonymous>:1:42',
      ].join('\n'),
    );

    expect(isInjectedScriptError(error)).toBe(false);
  });

  it('should not match errors without a stack', () => {
    const error = errorWithStack(undefined);

    expect(isInjectedScriptError(error)).toBe(false);
  });
});
