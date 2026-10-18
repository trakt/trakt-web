import type { GamePhase } from './GamePhase.ts';
import type { GuessResult } from './GuessResult.ts';
import type { VersusState } from './VersusState.ts';

type ToVersusStateParams = {
  phase: GamePhase;
  result: GuessResult | null;
};

export function toVersusState({
  phase,
  result,
}: ToVersusStateParams): VersusState {
  if (phase === 'reveal') return 'reveal';
  if (phase === 'result' || phase === 'over') return result ?? 'idle';

  return 'idle';
}
