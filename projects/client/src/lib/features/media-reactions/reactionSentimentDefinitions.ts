import * as m from '$lib/features/i18n/messages.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';

type ReactionSentimentDefinition = {
  label: () => string;
  /*
    A Noto animated-emoji codepoint rendered by ReactionEmoji, NOT a literal
    character. A raw glyph renders as whatever the viewer's OS happens to ship
    and never moves; the comment stack has always gone through Noto, and this
    is the same pipe.
    Source: https://googlefonts.github.io/noto-emoji-animation/
  */
  code: string;
};

// Presentational metadata for each sentiment. Ordering here is the canonical
// display order: positive, then divisive, then visceral.
export const reactionSentimentDefinitions: Readonly<
  Record<ReactionSentiment, ReactionSentimentDefinition>
> = {
  love: {
    label: () => m.reaction_sentiment_love(),
    code: '1f60d',
  },
  thrilled: {
    label: () => m.reaction_sentiment_thrilled(),
    code: '1f929',
  },
  mindblown: {
    label: () => m.reaction_sentiment_mindblown(),
    code: '1f92f',
  },
  moved: {
    label: () => m.reaction_sentiment_moved(),
    code: '1f979',
  },
  shook: {
    label: () => m.reaction_sentiment_shook(),
    code: '1f633',
  },
  bored: {
    label: () => m.reaction_sentiment_bored(),
    code: '1f971',
  },
  cringe: {
    label: () => m.reaction_sentiment_cringe(),
    code: '1f62c',
  },
  enraged: {
    label: () => m.reaction_sentiment_enraged(),
    code: '1f92c',
  },
  vomit: {
    label: () => m.reaction_sentiment_vomit(),
    code: '1f92e',
  },
};
