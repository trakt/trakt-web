import type { ErrorEvent as SentryErrorEvent } from '@sentry/sveltekit';
import { SCRIPT_FILE_PATTERN } from './SCRIPT_FILE_PATTERN.ts';

type StackFrame = {
  filename?: string;
  lineno?: number;
};

function toPathname(filename: string): string {
  try {
    return new URL(filename).pathname;
  } catch {
    return filename;
  }
}

const ANONYMOUS_FILENAMES = ['undefined', '<anonymous>'];

function isAnonymousFrame({ filename }: StackFrame): boolean {
  return !filename || ANONYMOUS_FILENAMES.includes(filename);
}

function isPageFirstLineFrame({ filename, lineno }: StackFrame): boolean {
  if (!filename || lineno !== 1) return false;

  return !SCRIPT_FILE_PATTERN.test(toPathname(filename));
}

function isInjectedFrame(frame: StackFrame): boolean {
  return isAnonymousFrame(frame) || isPageFirstLineFrame(frame);
}

export function isInjectedScriptEvent(event: SentryErrorEvent): boolean {
  const frames = event.exception?.values?.flatMap(
    ({ stacktrace }) => stacktrace?.frames ?? [],
  ) ?? [];

  if (frames.length === 0) return false;

  return frames.every(isInjectedFrame);
}
