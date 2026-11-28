import type { Component } from 'svelte';
import type { TopicId } from './models/TopicId.ts';

type LoadTopic = () => Promise<{ default: Component }>;

export const topicRegistry: Readonly<Record<TopicId, LoadTopic>> = {
  'avengers-doomsday': () =>
    import('./_internal/avengers-doomsday/AvengersDoomsdayTopic.svelte'),
  'dune-3': () => import('./_internal/dune-3/DuneThreeTopic.svelte'),
  dunesday: () => import('./_internal/dunesday/DunesdayTopic.svelte'),
};
