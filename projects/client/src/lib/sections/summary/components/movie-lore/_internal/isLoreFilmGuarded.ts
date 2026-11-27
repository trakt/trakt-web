type LoreFilmGuardParams = {
  isSpoilerHidden: boolean | undefined;
  isWatched: boolean;
  isRevealed: boolean;
};

export function isLoreFilmGuarded({
  isSpoilerHidden,
  isWatched,
  isRevealed,
}: LoreFilmGuardParams) {
  if (isWatched || isRevealed) return false;

  return isSpoilerHidden !== false;
}
