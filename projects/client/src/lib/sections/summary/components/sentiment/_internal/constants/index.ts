import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';

type MockSentiment = {
  title: string;
  sentiment: SentimentAnalysis;
};

export const MOCK_SENTIMENT: MockSentiment = {
  title: 'Star Wars: A New Hope',
  sentiment: {
    analysis:
      '"Star Wars" is a captivating space opera that revitalized classic storytelling tropes with groundbreaking special effects. The film masterfully blends elements of adventure, fantasy, and science fiction, appealing to a broad audience. The film\'s overall execution and imaginative world-building have cemented its place as a cinematic landmark.',
    highlight:
      "Features memorable performances and George Lucas's direction brought a unique vision to the screen.",
    aspect: {
      pros: [
        'Groundbreaking visual effects',
        'Revitalized classic storytelling',
        'Iconic and enhancing score',
        'Remarkable set and creature designs',
        "Universally appealing hero's journey",
      ],
      cons: [
        'Simplistic dialogue and plot',
        'Thinly drawn characters',
        'Emotionally exhausting',
      ],
    },
  },
};
