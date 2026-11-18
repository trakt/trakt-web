import { escapeXml } from './escapeXml.ts';

const SHORT_NAME = 'Trakt';
const DESCRIPTION = 'Search movies, shows and people on Trakt';
const ICON_PATH = '/pwa/android/icon_192.png';

export function buildOpenSearchXml(origin: string): string {
  const searchUrl = escapeXml(`${origin}/search?q={searchTerms}`);
  const selfUrl = escapeXml(`${origin}/opensearch.xml`);
  const iconUrl = escapeXml(`${origin}${ICON_PATH}`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">',
    `  <ShortName>${SHORT_NAME}</ShortName>`,
    `  <Description>${DESCRIPTION}</Description>`,
    '  <InputEncoding>UTF-8</InputEncoding>',
    `  <Image width="192" height="192" type="image/png">${iconUrl}</Image>`,
    `  <Url type="text/html" method="get" template="${searchUrl}"/>`,
    `  <Url type="application/opensearchdescription+xml" rel="self" template="${selfUrl}"/>`,
    `  <moz:SearchForm>${escapeXml(`${origin}/search`)}</moz:SearchForm>`,
    '</OpenSearchDescription>',
    '',
  ].join('\n');
}
