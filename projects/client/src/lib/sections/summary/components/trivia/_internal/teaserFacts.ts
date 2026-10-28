type TeaserFact = {
  key: string;
  text: string;
};

// Blurred sample behind the VIP upsell - shows the shape of the section
// without implying anything about the title being viewed. The rows never
// become interactive, and they are hidden from assistive tech.
export const teaserFacts: ReadonlyArray<TeaserFact> = [
  {
    key: 'teaser_0',
    text:
      'The opening sequence was shot in a single take after eleven failed attempts.',
  },
  {
    key: 'teaser_1',
    text:
      'A last-minute rewrite moved the confrontation from the harbour to the kitchen.',
  },
  {
    key: 'teaser_2',
    text: 'The score was recorded before the final cut was locked.',
  },
];
