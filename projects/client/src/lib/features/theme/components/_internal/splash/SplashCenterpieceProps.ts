import type { Snippet } from 'svelte';
import type { SeasonalThemeId } from '$lib/features/theme/models/SeasonalThemeId.ts';

export type SplashCenterpieceProps = {
  themeId: SeasonalThemeId;
  backdrop?: Snippet;
  emblem: Snippet;
};
