import { type Snippet } from 'svelte';

type DefaultVariant = {
  type: 'default';
};

type ScreenFillingVariant = {
  type: 'limit';
  itemWidth: number;
  actionCard: Snippet;
};

export type ListVariant = DefaultVariant | ScreenFillingVariant;
