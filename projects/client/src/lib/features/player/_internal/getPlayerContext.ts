import { getContext } from 'svelte';
import { assertDefined } from '../../../utils/assert/assertDefined.ts';
import {
  PLAYER_CONTEXT_KEY,
  type PlayerContextType,
} from './createPlayerContext.ts';

export function getPlayerContext() {
  const ctx = assertDefined<PlayerContextType>(
    getContext(PLAYER_CONTEXT_KEY),
    'Video player can only be used within the PlayerProvider context!',
  );

  return ctx;
}
