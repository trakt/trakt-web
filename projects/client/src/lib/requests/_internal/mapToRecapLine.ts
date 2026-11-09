import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
import type { RecapLine } from '../models/RecapLine.ts';
import type { RecapLineResponse } from '../models/RecapLineResponse.ts';

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
      headshot: findDefined(...(person.images?.headshot ?? []))
        ? toMediaImageUrl({
            type: 'people',
            id: person.ids.trakt,
            slot: 'headshot',
            size: 'thumb',
          })
        : null,
    })),
  };
}
