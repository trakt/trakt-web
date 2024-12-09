export enum LandingStepType {
  Track = 'track',
  Discover = 'discover',
  Share = 'share',
}

export type StepsIntl = {
  label: (step: LandingStepType) => string;
  description: (step: LandingStepType) => string;
};
