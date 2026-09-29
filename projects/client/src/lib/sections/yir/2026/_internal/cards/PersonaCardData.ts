import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';
import type { PersonaStat } from './PersonaStat.ts';

export type PersonaCardData = {
  persona: YirPersonaId;
  name: string;
  tagline: string;
  number: string;
  stats: ReadonlyArray<PersonaStat>;
  rating: number | null;
  share: number | null;
  scores: Readonly<Partial<Record<YirPersonaId, number>>>;
};
