import * as m from '$lib/features/i18n/messages.ts';
import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';

type PersonaCopy = {
  name: string;
  tagline: string;
};

const COPY: Record<YirPersonaId, () => PersonaCopy> = {
  'anime-voyager': () => ({
    name: m.yir_2026_persona_anime_voyager_name(),
    tagline: m.yir_2026_persona_anime_voyager_tagline(),
  }),
  'day-one-devotee': () => ({
    name: m.yir_2026_persona_day_one_devotee_name(),
    tagline: m.yir_2026_persona_day_one_devotee_tagline(),
  }),
  'weekend-marathoner': () => ({
    name: m.yir_2026_persona_weekend_marathoner_name(),
    tagline: m.yir_2026_persona_weekend_marathoner_tagline(),
  }),
  'comfort-rewatcher': () => ({
    name: m.yir_2026_persona_comfort_rewatcher_name(),
    tagline: m.yir_2026_persona_comfort_rewatcher_tagline(),
  }),
  omnivore: () => ({
    name: m.yir_2026_persona_omnivore_name(),
    tagline: m.yir_2026_persona_omnivore_tagline(),
  }),
  'opening-night': () => ({
    name: m.yir_2026_persona_opening_night_name(),
    tagline: m.yir_2026_persona_opening_night_tagline(),
  }),
  cinephile: () => ({
    name: m.yir_2026_persona_cinephile_name(),
    tagline: m.yir_2026_persona_cinephile_tagline(),
  }),
  critic: () => ({
    name: m.yir_2026_persona_critic_name(),
    tagline: m.yir_2026_persona_critic_tagline(),
  }),
  loyalist: () => ({
    name: m.yir_2026_persona_loyalist_name(),
    tagline: m.yir_2026_persona_loyalist_tagline(),
  }),
  curator: () => ({
    name: m.yir_2026_persona_curator_name(),
    tagline: m.yir_2026_persona_curator_tagline(),
  }),
  wildcard: () => ({
    name: m.yir_2026_persona_wildcard_name(),
    tagline: m.yir_2026_persona_wildcard_tagline(),
  }),
  'opening-act': () => ({
    name: m.yir_2026_persona_opening_act_name(),
    tagline: m.yir_2026_persona_opening_act_tagline(),
  }),
};

export function personaCopy(id: YirPersonaId): PersonaCopy {
  return COPY[id]();
}
