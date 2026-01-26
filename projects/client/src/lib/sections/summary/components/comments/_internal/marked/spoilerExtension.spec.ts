import { describe, expect, it } from 'vitest';
import {
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

  it('should match a multiline spoiler tag', () => {
    const content = 'line 1\nline 2';
    const match = matchSpoilerTag(`[spoiler]${content}[/spoiler]`);

    expect(match?.at(1)).to.equal(content);
  });
});
