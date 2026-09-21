import type { Tokens } from 'marked';
import { escapeHtml } from './escapeHtml.ts';
import { isSafeHref } from './isSafeHref.ts';

/**
 * Falls back to the alt text when an image source is not one a reader should
 * be made to fetch. `false` hands a safe image back to marked's own renderer.
 */
export function createImageRenderer() {
  return function (token: Tokens.Image): string | false {
    if (isSafeHref(token.href)) return false;

    return escapeHtml(token.text);
  };
}
