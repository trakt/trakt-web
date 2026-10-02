import type { Snippet } from 'svelte';

export type SwipeCarouselProps<T> = {
  items: ReadonlyArray<T>;
  item: Snippet<[T, number]>;
  enabled?: boolean;
  onSlideProgress?: (progress: number) => void;
  onDragging?: (isDragging: boolean) => void;
};
