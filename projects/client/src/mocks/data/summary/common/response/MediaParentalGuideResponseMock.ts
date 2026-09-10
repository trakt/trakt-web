export const MediaParentalGuideResponseMock = {
  guide: [
    {
      category: 'NUDITY',
      severity: 'NONE',
      signals: {
        none: 10,
        mild: 1,
        moderate: 0,
        severe: 0,
      },
    },
    {
      category: 'VIOLENCE',
      severity: 'MODERATE',
      signals: {
        none: 1,
        mild: 4,
        moderate: 12,
        severe: 2,
      },
    },
  ],
};
