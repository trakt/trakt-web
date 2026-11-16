import type { ShareUser } from '$lib/features/share/models/ShareUser.ts';
import type { PersonaCardData } from '../_internal/cards/PersonaCardData.ts';

export type YirShareData = {
  user: ShareUser;
  year: number;
  card: PersonaCardData;
  rarity: number;
  runnerUp: {
    name: string;
    accent: string;
  } | null;
  traits: ReadonlyArray<string>;
  streak: number;
};
