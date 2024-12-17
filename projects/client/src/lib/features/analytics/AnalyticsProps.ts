import type { AnalyticsEngine } from './_internal/AnalyticsEngine.ts';

export type AnalyticsProps = {
  onload: (engine: AnalyticsEngine) => void;
};
