import type { RendererThis, Token, Tokens } from 'marked';
import { describe, expect, it } from 'vitest';
import { createLinkRenderer } from './createLinkRenderer.ts';

describe('createLinkRenderer', () => {
  const mockParser = {
    parser: {
      parseInline: (tokens: Token[]) => tokens.map((t) => t.raw).join(''),
    },
  } as unknown as RendererThis;

  const render = (href: string) =>
    createLinkRenderer().call(mockParser, {
      type: 'link',
      raw: `[click](${href})`,
      href,
      title: null,
      text: 'click',
      tokens: [{ type: 'text', raw: 'click' } as Token],
    } as Tokens.Link);

  it('createLinkRenderer should defer a safe link to the default renderer', () => {
    expect(render('https://trakt.tv/movies/dune')).toBe(false);
  });

  it('createLinkRenderer should keep the text but drop the anchor for a script href', () => {
    expect(render('javascript:alert(1)')).toBe('click');
  });

  it('createLinkRenderer should drop the anchor for a data href', () => {
    expect(render('data:text/html,<script>alert(1)</script>')).toBe('click');
  });
});
