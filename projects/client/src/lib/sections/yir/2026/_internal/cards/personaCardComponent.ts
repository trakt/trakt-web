import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';
import type { Component } from 'svelte';
import AnimeVoyagerCard from './AnimeVoyagerCard.svelte';
import CinephileCard from './CinephileCard.svelte';
import ComfortRewatcherCard from './ComfortRewatcherCard.svelte';
import CriticCard from './CriticCard.svelte';
import CuratorCard from './CuratorCard.svelte';
import DayOneDevoteeCard from './DayOneDevoteeCard.svelte';
import LoyalistCard from './LoyalistCard.svelte';
import OmnivoreCard from './OmnivoreCard.svelte';
import OpeningActCard from './OpeningActCard.svelte';
import OpeningNightCard from './OpeningNightCard.svelte';
import type { PersonaCardProps } from './PersonaCardProps.ts';
import WeekendMarathonerCard from './WeekendMarathonerCard.svelte';
import WildcardCard from './WildcardCard.svelte';

const CARDS: Record<YirPersonaId, Component<PersonaCardProps>> = {
  'anime-voyager': AnimeVoyagerCard,
  'day-one-devotee': DayOneDevoteeCard,
  'weekend-marathoner': WeekendMarathonerCard,
  'comfort-rewatcher': ComfortRewatcherCard,
  omnivore: OmnivoreCard,
  'opening-night': OpeningNightCard,
  cinephile: CinephileCard,
  critic: CriticCard,
  loyalist: LoyalistCard,
  curator: CuratorCard,
  wildcard: WildcardCard,
  'opening-act': OpeningActCard,
};

export function personaCardComponent(
  id: YirPersonaId,
): Component<PersonaCardProps> {
  return CARDS[id];
}
