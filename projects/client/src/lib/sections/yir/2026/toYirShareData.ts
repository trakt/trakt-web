import type { ShareUser } from '$lib/features/share/models/ShareUser.ts';
import type { YirPersonaResult } from '$lib/requests/models/YirPersonaResult.ts';
import { toPersonaCardData } from './_internal/cards/toPersonaCardData.ts';
import { personaAccent } from './_internal/persona/personaAccent.ts';
import { personaCopy } from './_internal/persona/personaCopy.ts';
import { traitLabel } from './_internal/persona/traitLabel.ts';
import type { YirShareData } from './models/YirShareData.ts';

type ToYirShareDataProps = {
  result: YirPersonaResult;
  user: ShareUser;
  year: number;
};

export function toYirShareData({
  result,
  user,
  year,
}: ToYirShareDataProps): YirShareData {
  const { runnerUp } = result;

  return {
    user,
    year,
    card: toPersonaCardData({
      result,
      persona: result.persona,
      highlights: result.highlights,
    }),
    rarity: result.rarity,
    runnerUp: runnerUp
      ? { name: personaCopy(runnerUp).name, accent: personaAccent(runnerUp) }
      : null,
    traits: result.traits.map(traitLabel),
    streak: result.streak.longest,
  };
}
