import type { Tokens } from 'marked';
import { describe, expect, it } from 'vitest';
import {
  createParagraphSpoilerRenderer,
  matchSpoilerTag,
  matchSpoilerTagStart,
  spoilerRenderer,
} from './spoilerExtension.ts';

describe('spoilerExtension', () => {
  it('should match the start of a spoiler tag', () => {
    const index = matchSpoilerTagStart('[spoiler]');
    expect(index).to.equal(0);
  });

  it('should match the a spoiler tag', () => {
    const match = matchSpoilerTag('[spoiler]test[/spoiler]');
    expect(match).to.deep.equal(['[spoiler]test[/spoiler]', 'test']);
  });

  it('should not match the another tag', () => {
    const match = matchSpoilerTag('[bold]test[/bold]');
    expect(match).to.deep.equal(null);
  });

  it('should render a spoiler span', () => {
    const renderedResult = spoilerRenderer('test');

    expect(renderedResult).to.equal('<span>test</span>');
  });

  it('createParagraphSpoilerRenderer should return raw paragraph for comment spoilers', () => {
    const renderer = createParagraphSpoilerRenderer(true);
    const result = renderer({
      raw: 'plain paragraph',
      type: 'paragraph',
      text: 'plain paragraph',
      tokens: [{ type: 'text', raw: 'plain paragraph' }],
    });
    expect(result).to.equal('<p>plain paragraph</p>');
  });

  it('createParagraphSpoilerRenderer should wrap paragraph and convert spoiler tokens when not a comment spoiler', () => {
    const renderer = createParagraphSpoilerRenderer(false);
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

    const result = renderer(paragraphToken);
    expect(result).to.equal(
      '<p class="trakt-spoiler">before<span>hidden</span>after</p>',
    );
  });

  it('createParagraphSpoilerRenderer should not add class when there are no spoilers', () => {
    const renderer = createParagraphSpoilerRenderer(false);
    const paragraphToken: Tokens.Paragraph = {
      raw: 'only',
      type: 'paragraph',
      text: 'only',
      tokens: [{ type: 'text', raw: 'only' }],
    };

    const result = renderer(paragraphToken);
    expect(result).to.equal('<p>only</p>');
  });
});
