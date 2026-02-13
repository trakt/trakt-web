import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';

export const ShowSiloSentimentMappedMock: SentimentAnalysis = {
  'analysis':
    "Silo masterfully crafts a compelling dystopian mystery, immersing viewers in a claustrophobic yet intricate underground society. The series excels at building suspense through its enigmatic premise and detailed world-building, prompting constant speculation about the characters' reality. It's a slow-burn narrative that rewards patience with thoughtful exploration of control, truth, and societal structures.",
  'aspect': {
    'cons': [
      'Occasional slow pacing.',
      'Some plot predictability.',
    ],
    'pros': [
      'Compelling world-building and atmosphere.',
      'Engaging mystery and suspense.',
      'Strong narrative pacing and direction.',
      'Thought-provoking themes.',
    ],
  },
  'highlight':
    'The show is notable for its impressive production design that brings the subterranean world to life and for its skillful direction that enhances the oppressive atmosphere and pervasive sense of mystery.',
};
