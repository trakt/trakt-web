import type { RendererThis, Token, Tokens } from 'marked';
import { describe, expect, it } from 'vitest';
import { createParagraphRenderer } from './createParagraphRenderer.ts';

describe('createParagraphRenderer', () => {
  const mockParser = {
    parser: {
      parseInline: (tokens: Token[]) => {
        return tokens.map((t) => {
          if (t.type === 'text') return t.raw;
          if (t.type === 'spoiler') return `<span>${t.text}</span>`;
          if (t.type === 'em') return `<em>${t.text}</em>`;
          return t.raw;
        }).join('');
      },
    },
  } as unknown as RendererThis;

  it('createParagraphRenderer should return raw paragraph for comment spoilers', () => {
    const renderer = createParagraphRenderer(true);
    const result = renderer.call(mockParser, {
      raw: 'plain paragraph',
      type: 'paragraph',
      text: 'plain paragraph',
      tokens: [{ type: 'text', raw: 'plain paragraph' }],
    });
    expect(result).to.equal('<p>plain paragraph</p>');
  });

  it('createParagraphRenderer should wrap paragraph and convert spoiler tokens when not a comment spoiler', () => {
    const renderer = createParagraphRenderer(false);
    const paragraphToken: Tokens.Paragraph = {
      type: 'paragraph',
      raw: 'before[spoiler]hidden[/spoiler]after',
      text: 'beforehiddenafter',
      tokens: [
        { type: 'text', raw: 'before' },
        { type: 'spoiler', text: 'hidden', raw: '[spoiler]hidden[/spoiler]' },
        { type: 'text', raw: 'after' },
      ],
    };

    const result = renderer.call(mockParser, paragraphToken);
    expect(result).to.equal(
      '<p class="trakt-spoiler">before<span>hidden</span>after</p>',
    );
  });

  it('createParagraphRenderer should not add class when there are no spoilers', () => {
    const renderer = createParagraphRenderer(false);
    const paragraphToken: Tokens.Paragraph = {
      raw: 'only',
      type: 'paragraph',
      text: 'only',
      tokens: [{ type: 'text', raw: 'only' }],
    };

    const result = renderer.call(mockParser, paragraphToken);
    expect(result).to.equal('<p>only</p>');
  });

  it('createParagraphRenderer should render markdown formatting like italic', () => {
    const renderer = createParagraphRenderer(false);
    const paragraphToken: Tokens.Paragraph = {
      raw: 'text with *italic* formatting',
      type: 'paragraph',
      text: 'text with italic formatting',
      tokens: [
        { type: 'text', raw: 'text with ' },
        { type: 'em', text: 'italic', raw: '*italic*' },
        { type: 'text', raw: ' formatting' },
      ],
    };

    const result = renderer.call(mockParser, paragraphToken);
    expect(result).to.equal('<p>text with <em>italic</em> formatting</p>');
  });
});
