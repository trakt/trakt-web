import type { RendererThis, Tokens } from 'marked';
import { isSafeHref } from './isSafeHref.ts';

/**
 * Keeps the text of a link whose href is not one a reader should be sent to,
 * and drops the anchor around it. `false` hands a safe link back to marked's
 * own renderer.
 */
export function createLinkRenderer() {
  return function (this: RendererThis, token: Tokens.Link): string | false {
    if (isSafeHref(token.href)) return false;

    return this.parser.parseInline(token.tokens);
  };
}
