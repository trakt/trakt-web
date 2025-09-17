<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import type { MarkAsWatchedActionProps } from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedActionProps";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { WatchlistActionProps } from "$lib/sections/media-actions/watchlist/WatchListActionProps";
  import ListDropdown from "$lib/sections/summary/components/list-dropdown/ListDropdown.svelte";
  import type { ListDropdownProps } from "$lib/sections/summary/components/list-dropdown/ListDropdownProps";
  import { useAllPersonalLists } from "$lib/sections/summary/components/list-dropdown/useAllPersonalLists";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import { TrackIntlProvider } from "./TrackIntlProvider";

  const { media }: { media: MediaEntry } = $props();

  const isAired = $derived(media.airDate && media.airDate <= new Date());

  const { watchCount } = $derived(useWatchCount({ media, type: media.type }));
  const { lists } = useAllPersonalLists();

  const commonProps = $derived({
    size: "small" as const,
    title: media.title,
    type: media.type,
    media,
  });

  const watchlistProps = $derived<WatchlistActionProps>({
    ...commonProps,
    style: "normal",
  });
  const listProps = $derived<ListDropdownProps>(commonProps);
  const markAsWatchedProps = $derived<MarkAsWatchedActionProps>({
    ...commonProps,
    style: "normal",
    allowRewatch: $watchCount > 0,
  });
</script>

{#snippet saveAction()}
  {#if $lists.length === 0}
    <WatchlistAction {...watchlistProps} />
  {:else}
    <ListDropdown {...listProps} />
  {/if}
{/snippet}

{#if isAired}
  <MarkAsWatchedAction {...markAsWatchedProps} i18n={TrackIntlProvider} />
{:else}
  {@render saveAction()}
{/if}
