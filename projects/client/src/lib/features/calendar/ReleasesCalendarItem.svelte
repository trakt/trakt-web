<script lang="ts">
  import type { ReleasesCalendarEntry } from "$lib/requests/queries/calendars/releasesCalendarQuery";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ListsDrawer from "$lib/sections/components/lists-drawer/ListsDrawer.svelte";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { hasAired } from "$lib/utils/media/hasAired";
  import CalendarItem from "./CalendarItem.svelte";

  type ReleasesCalendarItemProps = {
    item: ReleasesCalendarEntry;
    variant?: "default" | "summary";
  };

  const {
    item,
    variant = "default",
  }: ReleasesCalendarItemProps = $props();

  const listTarget = $derived("show" in item ? item.show : item);

  let isListsDrawerOpen = $state(false);
</script>

{#snippet popupActions()}
  <RenderFor audience="authenticated">
    <WatchlistAction
      style="dropdown-item"
      title={listTarget.title}
      type={listTarget.type}
      media={listTarget}
    />

    {#if hasAired(item)}
      {#if "show" in item}
        <MarkAsWatchedAction
          style="dropdown-item"
          type="episode"
          title={item.title}
          show={item.show}
          media={item}
          mode="hybrid"
        />
      {:else}
        <MarkAsWatchedAction
          style="dropdown-item"
          title={item.title}
          type={item.type}
          media={item}
        />
      {/if}
    {/if}

    <ListAction
      style="dropdown-item"
      media={listTarget}
      title={listTarget.title}
      onClick={() => (isListsDrawerOpen = true)}
    />
  </RenderFor>
{/snippet}

<CalendarItem
  {item}
  {variant}
  source="releases"
  {popupActions}
/>

{#if isListsDrawerOpen}
  <ListsDrawer
    media={listTarget}
    onClose={() => (isListsDrawerOpen = false)}
    metaInfo={listTarget.title}
  />
{/if}
