import type { MovieLore } from '$lib/requests/models/MovieLore.ts';
import { MovieLoreVipMappedMock } from './MovieLoreVipMappedMock.ts';

export const MovieLorePublicMappedMock: MovieLore = {
  ...MovieLoreVipMappedMock,
  locked: { lore: 6, previously: 1 },
  lore: [],
  previously: [],
};
