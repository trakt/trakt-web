import type { SpotlightKeyword } from '../../models/SpotlightKeyword.ts';

export type SpotlightRoute = {
  id: string;
  url: string;
  label: () => string;
  keywords: ReadonlyArray<SpotlightKeyword>;
};
