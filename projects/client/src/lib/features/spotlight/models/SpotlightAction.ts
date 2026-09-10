import type { SpotlightKeyword } from './SpotlightKeyword.ts';

export type SpotlightAction = {
  id: string;
  label: () => string;
  keywords: ReadonlyArray<SpotlightKeyword>;
  run: () => void;
};
