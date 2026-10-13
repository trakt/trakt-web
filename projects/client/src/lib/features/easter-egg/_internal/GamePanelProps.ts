import type { GameTitle } from './GameTitle.ts';
import type { Guess } from './Guess.ts';
import type { GuessResult } from './GuessResult.ts';
import type { PanelRole } from './PanelRole.ts';

export type GamePanelProps = {
  title: GameTitle;
  role: PanelRole;
  guess: Guess | null;
  result: GuessResult | null;
  leaning: Guess | null;
  entranceIndex: number | null;
  onguess: (guess: Guess) => void;
};
