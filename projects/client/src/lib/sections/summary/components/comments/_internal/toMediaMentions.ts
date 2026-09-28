import type { RichTextMention } from '$lib/components/rich-text/RichTextMention.ts';
import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export function toMediaMentions(
  { cast }: Pick<MediaCrew, 'cast'>,
): ReadonlyArray<RichTextMention> {
  const uniqueCast = new Map(cast.map((member) => [member.key, member]));

  return [...uniqueCast.values()].map((member) => ({
    name: member.name,
    href: `${SEO_ORIGIN}${UrlBuilder.people(member.key)}`,
    detail: member.characterName || undefined,
  }));
}
