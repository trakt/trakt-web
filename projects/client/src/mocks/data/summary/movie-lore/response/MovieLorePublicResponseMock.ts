import type { MovieLoreResponse } from '$lib/requests/models/MovieLoreResponse.ts';
import { MovieLoreVipResponseMock } from './MovieLoreVipResponseMock.ts';

export const MovieLorePublicResponseMock: MovieLoreResponse = {
  kind: MovieLoreVipResponseMock.kind,
  setup: MovieLoreVipResponseMock.setup,
  watchFirst: MovieLoreVipResponseMock.watchFirst,
  earlier: MovieLoreVipResponseMock.earlier,
  attribution: MovieLoreVipResponseMock.attribution,
  locked: { lore: 6, previously: 1 },
};
