import type { MediaInputDefault } from '$lib/models/MediaInput.ts';

type MixtapeResult = { media: MediaInputDefault; because: number };

export type MixtapeResultsProps = {
  results: ReadonlyArray<MixtapeResult>;
  isLoading: boolean;
  pickTitles: ReadonlyArray<string>;
  titleOf: (id: number) => string | null;
  skipHref: (id: number) => string;
  changeHref: string;
  startOverHref: string;
  onResult: (action: 'open' | 'skip' | 'watchlist', position: number) => void;
};
