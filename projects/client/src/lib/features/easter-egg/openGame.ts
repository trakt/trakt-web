import { pushState } from '$app/navigation';
import { page } from '$app/state';

export function openGame() {
  if (page.state.isPlayingGame) return;

  pushState('', { isPlayingGame: true });
}
