import * as m from '$lib/features/i18n/messages.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';

type ReactionTone = 'positive' | 'divisive' | 'negative';

type ReactionSentimentDefinition = {
  label: () => string;
  glyph: string;
  tone: ReactionTone;
};

// Presentational metadata for each sentiment. Ordering here is the canonical
// display order used by the chip row (positive → divisive → visceral).
export const reactionSentimentDefinitions: Readonly<
  Record<ReactionSentiment, ReactionSentimentDefinition>
> = {
  love: {
    label: () => m.reaction_sentiment_love(),
    glyph: '😍',
    tone: 'positive',
  },
  thrilled: {
    label: () => m.reaction_sentiment_thrilled(),
    glyph: '🤩',
    tone: 'positive',
  },
  mindblown: {
    label: () => m.reaction_sentiment_mindblown(),
    glyph: '🤯',
    tone: 'positive',
  },
  moved: {
    label: () => m.reaction_sentiment_moved(),
    glyph: '🥹',
    tone: 'positive',
  },
  shook: {
    label: () => m.reaction_sentiment_shook(),
    glyph: '😳',
    tone: 'divisive',
  },
  bored: {
    label: () => m.reaction_sentiment_bored(),
    glyph: '🥱',
    tone: 'negative',
  },
  cringe: {
    label: () => m.reaction_sentiment_cringe(),
    glyph: '😬',
    tone: 'negative',
  },
  enraged: {
    label: () => m.reaction_sentiment_enraged(),
    glyph: '🤬',
    tone: 'negative',
  },
  vomit: {
    label: () => m.reaction_sentiment_vomit(),
    glyph: '🤮',
    tone: 'negative',
  },
};
