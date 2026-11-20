import type { SpotlightKeyword } from '$lib/features/spotlight/models/SpotlightKeyword.ts';

export type DevtoolsEntry = {
  id: string;
  title: string;
  description: string;
  keywords: ReadonlyArray<SpotlightKeyword>;
  run: () => void;
};
