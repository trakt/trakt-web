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

  it('should render a spoiler tag', () => {
    const renderedResult = spoilerRenderer('test', false);

    expect(renderedResult).to.equal("<p class='trakt-spoiler'>test</p>");
  });

  it('should not render a spoiler tag if the entire comment is a spoiler', () => {
    const renderedResult = spoilerRenderer('test', true);

    expect(renderedResult).to.equal('<p>test</p>');
  });
});
