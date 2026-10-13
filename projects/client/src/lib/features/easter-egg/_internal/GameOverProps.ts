import type { GameTitle } from './GameTitle.ts';

export type GameOverProps = {
  title: GameTitle;
  streak: number;
  best: number;
  isNewBest: boolean;
  onplayagain: () => void;
  onclose?: () => void;
};
