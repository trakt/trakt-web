import type { Tokens } from 'marked';
import { escapeHtml } from './escapeHtml.ts';

/**
 * Renders raw HTML an author typed as visible text rather than as markup.
 *
 * Comment text used to be sanitized server-side; it is now returned as typed,
 * and `{@html}` is the sink it lands in. marked routes both block-level and
 * inline HTML through this one renderer.
 */
export function createHtmlRenderer() {
  return function ({ text }: Tokens.HTML | Tokens.Tag): string {
    return escapeHtml(text);
  };
}
