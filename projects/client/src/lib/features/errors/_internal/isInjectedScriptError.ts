import { SCRIPT_FILE_PATTERN } from '../SCRIPT_FILE_PATTERN.ts';

/*
  Frames from our own code always reference a bundled script file. WebKit
  attributes errors thrown by injected script strings (e.g. the iOS app's
  WKWebView `evaluateJavaScript`, which drives anchor scrolling in embedded
  views like Year in Review) to the document URL as `global code@<page-url>`,
  so they slip past the hostname-based external-noise check even though no
  app code is involved.
*/
export function isInjectedScriptError(error: Error): boolean {
  const stack = error.stack;
  if (!stack) return false;
  if (!stack.includes('global code@')) return false;

  return !SCRIPT_FILE_PATTERN.test(stack);
}
