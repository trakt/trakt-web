import type { GameTitle } from './GameTitle.ts';

export type RatedHigherProps = {
  titles: ReadonlyArray<GameTitle>;
  isRevealed: boolean;
  onplayagain: () => void;
  onclose: () => void;
};
