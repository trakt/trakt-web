import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { ListDropdownItemIntl } from '$lib/sections/summary/components/list-dropdown/_internal/ListDropdownItemIntl.ts';
import type { Writable } from 'svelte/store';

export type ListDropdownItemProps = {
  title: string;
  list: MediaListSummary;
  isUpdating: Writable<boolean>;
  i18n?: ListDropdownItemIntl;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label' | 'type' | 'value'>;
