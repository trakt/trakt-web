import type { PersonSocialMedia } from '$lib/requests/models/PersonSocialMedia.ts';
import type { SocialMediaLink } from './SocialMediaLink.ts';

const INLINE_LIMIT = 3;

function toLinks(socialMedia: PersonSocialMedia | Nil): SocialMediaLink[] {
  const {
    youtube,
    wikipedia,
    wikipediaLanguage,
    instagram,
    x,
    tiktok,
    facebook,
    wikidata,
  } = socialMedia ?? {};

  const links: (SocialMediaLink | null)[] = [
    youtube ? { type: 'youtube', id: youtube } : null,
    wikipedia
      ? { type: 'wikipedia', id: wikipedia, language: wikipediaLanguage }
      : null,
    instagram ? { type: 'instagram', id: instagram } : null,
    x ? { type: 'x', id: x } : null,
    tiktok ? { type: 'tiktok', id: tiktok } : null,
    facebook ? { type: 'facebook', id: facebook } : null,
    wikidata ? { type: 'wikidata', id: wikidata } : null,
  ];

  return links.filter((link) => link != null);
}

export function splitSocialMediaLinks(socialMedia: PersonSocialMedia | Nil): {
  inline: SocialMediaLink[];
  overflow: SocialMediaLink[];
} {
  const links = toLinks(socialMedia);
  const hasSingleOverflow = links.length === INLINE_LIMIT + 1;
  const inlineCount = hasSingleOverflow ? links.length : INLINE_LIMIT;

  return {
    inline: links.slice(0, inlineCount),
    overflow: links.slice(inlineCount),
  };
}
