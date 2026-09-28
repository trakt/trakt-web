import { describe, expect, it } from 'vitest';
import type { RichTextMention } from '../RichTextMention.ts';
import { toMentionMatches } from './toMentionMatches.ts';

const mentions: ReadonlyArray<RichTextMention> = [
  { name: 'Steve Carell', href: 'https://app.trakt.tv/people/steve-carell' },
  { name: 'Steven Yeun', href: 'https://app.trakt.tv/people/steven-yeun' },
  { name: 'Rainn Wilson', href: 'https://app.trakt.tv/people/rainn-wilson' },
];

describe('util: toMentionMatches', () => {
  it('should return the first entries when the query is empty', () => {
    const result = toMentionMatches({ mentions, query: '  ', limit: 2 });

    expect(result.map((mention) => mention.name)).toEqual([
      'Steve Carell',
      'Steven Yeun',
    ]);
  });

  it('should match names regardless of case', () => {
    const result = toMentionMatches({ mentions, query: 'WILS', limit: 5 });

    expect(result.map((mention) => mention.name)).toEqual(['Rainn Wilson']);
  });

  it('should return nothing when no name matches', () => {
    expect(toMentionMatches({ mentions, query: 'zzz', limit: 5 })).toEqual([]);
  });
});
