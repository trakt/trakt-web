import { describe, expect, it } from 'vitest';
import { splitSocialMediaLinks } from './splitSocialMediaLinks.ts';

const types = (links: { type: string }[]) => links.map(({ type }) => type);

describe('splitSocialMediaLinks', () => {
  it('should keep the first three inline and the rest in overflow with all links', () => {
    const { inline, overflow } = splitSocialMediaLinks({
      youtube: 'channel',
      wikipedia: 'Page',
      instagram: 'insta',
      x: 'handle',
      tiktok: 'tok',
      facebook: 'fb',
      wikidata: 'Q1',
    });

    expect(types(inline)).to.deep.equal(['youtube', 'wikipedia', 'instagram']);
    expect(types(overflow)).to.deep.equal([
      'x',
      'tiktok',
      'facebook',
      'wikidata',
    ]);
  });

  it('should skip the links the person does not have', () => {
    const { inline, overflow } = splitSocialMediaLinks({
      instagram: 'insta',
      x: 'handle',
      facebook: 'fb',
      wikipedia: 'Page',
      wikidata: 'Q1',
    });

    expect(types(inline)).to.deep.equal(['wikipedia', 'instagram', 'x']);
    expect(types(overflow)).to.deep.equal(['facebook', 'wikidata']);
  });

  it('should show a single overflow link inline', () => {
    const { inline, overflow } = splitSocialMediaLinks({
      youtube: 'channel',
      wikipedia: 'Page',
      instagram: 'insta',
      x: 'handle',
    });

    expect(types(inline)).to.deep.equal([
      'youtube',
      'wikipedia',
      'instagram',
      'x',
    ]);
    expect(overflow).to.deep.equal([]);
  });

  it('should keep wikipedia and wikidata inline', () => {
    const { inline, overflow } = splitSocialMediaLinks({
      wikipedia: 'Page',
      wikipediaLanguage: 'de',
      wikidata: 'Q1',
    });

    expect(inline).to.deep.equal([
      { type: 'wikipedia', id: 'Page', language: 'de' },
      { type: 'wikidata', id: 'Q1' },
    ]);
    expect(overflow).to.deep.equal([]);
  });

  it('should be empty without any link', () => {
    expect(splitSocialMediaLinks({})).to.deep.equal({
      inline: [],
      overflow: [],
    });
    expect(splitSocialMediaLinks(undefined)).to.deep.equal({
      inline: [],
      overflow: [],
    });
  });
});
