import type { RichTextMention } from '../RichTextMention.ts';

type ToMentionMatchesProps = {
  mentions: ReadonlyArray<RichTextMention>;
  query: string;
  limit: number;
};

export function toMentionMatches(
  { mentions, query, limit }: ToMentionMatchesProps,
): ReadonlyArray<RichTextMention> {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return mentions
    .filter((mention) =>
      mention.name.toLocaleLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit);
}
