import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { RecapLine } from '../models/RecapLine.ts';
import type { RecapLineResponse } from '../models/RecapLineResponse.ts';
import { thumbUrl } from './thumbUrl.ts';

export function mapToRecapLine(
  line: RecapLineResponse,
  index: number,
): RecapLine {
  return {
    key: `recap-line-${index}`,
    text: toRelativeMarkdownLinks(line.text, SEO_ORIGIN),
    people: line.people.map(({ character, person }, personIndex) => ({
      key: `person-${person.ids.trakt}-${personIndex}`,
      name: person.name,
      character: character ?? null,
      headshot:
        prependHttps(
          thumbUrl(findDefined(...(person.images?.headshot ?? []))),
        ) ?? null,
    })),
  };
}
