import type { Match } from '$lib/requests/models/Match.ts';
import { MatchResponseMock } from '../response/MatchResponseMock.ts';

export const MatchMappedMock: Match = {
  score: MatchResponseMock.match,
  taste: MatchResponseMock.taste,
};
