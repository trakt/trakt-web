import type { ErrorEvent as SentryErrorEvent } from '@sentry/sveltekit';
import { describe, expect, it } from 'vitest';
import appHtml from '../../../app.html?raw';
import { isInjectedScriptEvent } from './isInjectedScriptEvent.ts';

type Frame = { filename?: string; lineno?: number };

function toEvent(...frames: Frame[]): SentryErrorEvent {
  return {
    type: undefined,
    exception: {
      values: [{ type: 'TypeError', stacktrace: { frames } }],
    },
  };
}

describe('util: isInjectedScriptEvent', () => {
  it('should flag a frame on the first line of the page', () => {
    expect(
      isInjectedScriptEvent(
        toEvent({ filename: 'https://app.trakt.tv/home', lineno: 1 }),
      ),
    ).toBe(true);
  });

  it('should flag a frame without a file name', () => {
    expect(isInjectedScriptEvent(toEvent({ filename: 'undefined' })))
      .toBe(true);
    expect(isInjectedScriptEvent(toEvent({ lineno: 269 }))).toBe(true);
  });

  it('should keep an error that passes through our bundle', () => {
    expect(
      isInjectedScriptEvent(
        toEvent(
          { filename: 'https://app.trakt.tv/home', lineno: 1 },
          {
            filename: 'https://app.trakt.tv/_app/immutable/chunks/abc.js',
            lineno: 1,
          },
        ),
      ),
    ).toBe(false);
  });

  it('should keep an error from a dev-served source file', () => {
    expect(
      isInjectedScriptEvent(
        toEvent({
          filename: 'http://localhost:5173/src/lib/Card.svelte?t=1',
          lineno: 1,
        }),
      ),
    ).toBe(false);
  });

  it('should keep an error from our inline page script', () => {
    expect(
      isInjectedScriptEvent(
        toEvent({ filename: 'https://app.trakt.tv/home', lineno: 32 }),
      ),
    ).toBe(false);
  });

  it('should keep an error without a stack trace', () => {
    expect(isInjectedScriptEvent(toEvent())).toBe(false);
    expect(isInjectedScriptEvent({ type: undefined })).toBe(false);
  });

  it('should keep the first line of app.html free of scripts', () => {
    expect(appHtml.split('\n').at(0)).toBe('<!DOCTYPE html>');
  });
});
