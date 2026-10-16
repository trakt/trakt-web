import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { MixtapeSlot } from './MixtapeSlot.ts';

export type MixtapeResultAction = 'open' | 'skip' | 'watchlist';

export type MixtapeResultsProps = {
  slots: ReadonlyArray<MixtapeSlot>;
  isLoading: boolean;
  canSwap: boolean;
  picked: ReadonlyArray<MovieEntry | ShowEntry>;
  titleOf: (id: number) => string | null;
  closeHref: string;
  changeHref: string;
  startOverHref: string;
  onSkip: (id: number) => void;
  onUndo: () => void;
  onMore: (ids: ReadonlyArray<number>) => void;
  onResult: (action: MixtapeResultAction, position: number) => void;
};
