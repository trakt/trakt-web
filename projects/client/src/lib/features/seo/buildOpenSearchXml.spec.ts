import { describe, expect, it } from 'vitest';
import { buildOpenSearchXml } from './buildOpenSearchXml.ts';

describe('util: buildOpenSearchXml', () => {
  const xml = buildOpenSearchXml('https://app.trakt.tv');

  it('should name the engine Trakt', () => {
    expect(xml).to.include('<ShortName>Trakt</ShortName>');
  });

  it('should point the search template at the search route', () => {
    expect(xml).to.include(
      'template="https://app.trakt.tv/search?q={searchTerms}"',
    );
  });

  it('should link back to itself for automatic updates', () => {
    expect(xml).to.include(
      'rel="self" template="https://app.trakt.tv/opensearch.xml"',
    );
  });

  it('should use the icon from the given origin', () => {
    expect(xml).to.include(
      '>https://app.trakt.tv/pwa/android/icon_192.png</Image>',
    );
  });

  it('should escape the origin', () => {
    expect(buildOpenSearchXml('https://a.test/"&')).to.include(
      'https://a.test/&quot;&amp;/search',
    );
  });
});
