import type {
  CreateInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/svelte-query';
import type { Paginatable } from '../../../requests/models/Paginatable.ts';

export type InfiniteQuery<T> = CreateInfiniteQueryOptions<
  Paginatable<T>,
  Error,
  InfiniteData<Paginatable<T>>,
  readonly unknown[],
  number
>;
