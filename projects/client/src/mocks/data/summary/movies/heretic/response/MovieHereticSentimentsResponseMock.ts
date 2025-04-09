import type { SentimentsResponse } from '@trakt/api';

export const MovieHereticSentimentsResponseMock: SentimentsResponse = {
  'bad': [
    {
      'sentiment': 'Third act falls apart and becomes conventional',
      'comment_ids': [
        746848,
        749438,
        766553,
        734193,
      ],
    },
    {
      'sentiment': 'Ending feels rushed and unsatisfying',
      'comment_ids': [
        745820,
        747763,
        749234,
        748441,
      ],
    },
  ],
  'good': [
    {
      'sentiment':
        "Brilliant performances, especially Hugh Grant's captivating villain",
      'comment_ids': [
        745176,
        745136,
        731761,
        734214,
        736450,
        746194,
        745437,
        748383,
        751278,
      ],
    },
    {
      'sentiment': 'Thought-provoking exploration of faith and belief systems',
      'comment_ids': [
        733764,
        742229,
        746845,
        747330,
        773732,
        746459,
      ],
    },
    {
      'sentiment': 'Excellent script and dialogue-driven tension',
      'comment_ids': [
        745156,
        748532,
        734383,
        733609,
        761644,
      ],
    },
    {
      'sentiment':
        "Strong atmospheric thriller that doesn't rely on special effects",
      'comment_ids': [
        733408,
        751895,
        752822,
        771080,
        733367,
      ],
    },
  ],
  'analyzed_at': '2025-03-02T15:57:44.000Z',
  'comment_count': 105,
};
