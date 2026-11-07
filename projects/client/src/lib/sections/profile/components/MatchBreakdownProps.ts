import type { UserMatch } from '$lib/requests/models/UserMatch.ts';
import type { MatchFace } from './_internal/MatchHeroProps.ts';

export type MatchBreakdownProps = {
  match?: UserMatch;
  user: MatchFace;
  profile: MatchFace;
};
