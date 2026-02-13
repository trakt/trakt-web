import type { SentimentResponse } from '$lib/requests/models/SentimentResponse.ts';

export const ShowSiloSentimentResponseMock: SentimentResponse = {
  'sentiment': {
    'overall': 'positive',
    'score': 0.85,
    'keywords': {
      'pros': [
        'intriguing',
        'atmospheric',
        'suspenseful',
        'well-crafted',
      ],
      'cons': [
        'slow-burn',
        'predictable',
      ],
    },
  },
  'analysis':
    "Silo masterfully crafts a compelling dystopian mystery, immersing viewers in a claustrophobic yet intricate underground society. The series excels at building suspense through its enigmatic premise and detailed world-building, prompting constant speculation about the characters' reality. It's a slow-burn narrative that rewards patience with thoughtful exploration of control, truth, and societal structures.",
  'aspect': {
    'pros': [
      {
        'theme': 'Compelling world-building and atmosphere',
        'confidence': 0.9,
      },
      {
        'theme': 'Engaging mystery and suspense',
        'confidence': 0.85,
      },
      {
        'theme': 'Strong narrative pacing and direction',
        'confidence': 0.8,
      },
      {
        'theme': 'Thought-provoking themes',
        'confidence': 0.75,
      },
    ],
    'cons': [
      {
        'theme': 'Occasional slow pacing',
        'confidence': 0.5,
      },
      {
        'theme': 'Some plot predictability',
        'confidence': 0.4,
      },
    ],
  },
  'highlight':
    'The show is notable for its impressive production design that brings the subterranean world to life and for its skillful direction that enhances the oppressive atmosphere and pervasive sense of mystery.',
};
