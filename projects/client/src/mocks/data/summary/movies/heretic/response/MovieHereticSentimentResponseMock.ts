import type { SentimentResponse } from '$lib/requests/models/SentimentResponse.ts';

export const MovieHereticSentimentResponseMock: SentimentResponse = {
  'sentiment': {
    'overall': 'mixed',
    'score': 0.7,
    'keywords': {
      'pros': [
        'atmospheric',
        'tense',
        'unique premise',
      ],
      'cons': [
        'uneven pacing',
        'predictable elements',
      ],
    },
  },
  'analysis':
    'Heretic offers a disturbing exploration of faith and extremism, presenting a chilling narrative that builds suspense effectively through its claustrophobic atmosphere and unsettling themes. While the film excels in creating a palpable sense of dread and features some thought-provoking concepts, its execution occasionally falters, leading to a narrative that some may find less impactful than intended.',
  'aspect': {
    'pros': [
      {
        'theme': 'Atmospheric tension',
        'confidence': 0.9,
      },
      {
        'theme': 'Intriguing premise',
        'confidence': 0.85,
      },
      {
        'theme': 'Visually striking',
        'confidence': 0.8,
      },
    ],
    'cons': [
      {
        'theme': 'Pacing issues',
        'confidence': 0.7,
      },
      {
        'theme': 'Familiar tropes',
        'confidence': 0.65,
      },
    ],
  },
  'highlight':
    "The film's strength lies in its oppressive atmosphere and the commitment to its grim, theological horror premise, creating a disturbing and memorable viewing experience.",
};
