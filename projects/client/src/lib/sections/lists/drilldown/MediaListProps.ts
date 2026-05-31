import type { ListDrilldownLinkProps } from '$lib/components/lists/section-list/models/ListDrilldownLinkProps.ts';
import type { SectionListId } from '$lib/components/lists/section-list/models/SectionListId.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { Snippet } from 'svelte';
import type { LimitStore } from './LimitStore.ts';
import type { PaginatableStore } from './PaginatableStore.ts';

export type MediaListProps<T, M> = {
  id: SectionListId;
  title?: string;
  type: M;
  item: Snippet<[T]>;
  ctaItem?: Snippet;
  useList: LimitStore<T, M>;
  actions?: Snippet<[T[], M]>;
  empty?: Snippet;
  metaInfo?: Snippet;
  drilldown?: ListDrilldownLinkProps;
  variant?: 'portrait' | 'landscape';
  titleAction?: Snippet;
} & FilterParams;

export type DrilledMediaListProps<T, M> =
  & Omit<MediaListProps<T, M>, 'useList' | 'actions' | 'id'>
  & {
    id: string;
    useList: PaginatableStore<T, M>;
    actions?: Snippet<[]>;
    cardOrientation?: 'landscape' | 'portrait';
    listActions?: Snippet;
    groupBy?: (item: T) => string;
    groupHeader?: Snippet<[string]>;
  };
