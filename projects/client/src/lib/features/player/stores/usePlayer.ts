import { getPlayerContext } from '../_internal/getPlayerContext.ts';

export function usePlayer() {
  const { embedId } = getPlayerContext();

  return {
    play: (url: string) => {
      const key = new URL(url).searchParams.get('v');

      embedId.set(key);
    },
  };
}
