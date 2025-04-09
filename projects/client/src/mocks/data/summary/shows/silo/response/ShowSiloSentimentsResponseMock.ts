import type { SentimentsResponse } from '@trakt/api';

export const ShowSiloSentimentsResponseMock: SentimentsResponse = {
  'bad': [
    {
      'sentiment':
        'Second season is extremely slow with little plot progression',
      'comment_ids': [
        748824,
        755708,
        760042,
        756561,
        761305,
      ],
    },
    {
      'sentiment': 'Story becomes tedious and drags after first few episodes',
      'comment_ids': [
        567824,
        571946,
        572240,
        575061,
      ],
    },
    {
      'sentiment': 'Technical and engineering scenes lack realism',
      'comment_ids': [
        564126,
        577627,
        588737,
      ],
    },
    {
      'sentiment': 'Plot becomes predictable and repetitive',
      'comment_ids': [
        564714,
        738498,
        755552,
      ],
    },
  ],
  'good': [
    {
      'sentiment': 'Excellent world-building and production quality',
      'comment_ids': [
        577520,
        573848,
        574407,
        577163,
        582262,
        577687,
      ],
    },
    {
      'sentiment': 'Intriguing mystery that keeps viewers hooked',
      'comment_ids': [
        549673,
        567841,
        581555,
        581559,
        637256,
        755504,
      ],
    },
    {
      'sentiment': 'Strong performance by Rebecca Ferguson',
      'comment_ids': [
        743732,
        669664,
        577520,
      ],
    },
    {
      'sentiment': 'First season is compelling and well-paced',
      'comment_ids': [
        562388,
        562540,
        563285,
        574411,
        755443,
      ],
    },
  ],
  'analyzed_at': '2025-03-02T18:36:09.000Z',
  'comment_count': 128,
};
