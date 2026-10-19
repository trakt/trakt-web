<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { useEpisodeType } from "./useEpisodeType";
  import CalendarTitleActions from "./CalendarTitleActions.svelte";
  import { useIsCalendarDocked } from "./useIsCalendarDocked";

  const { title, hasFeed = false }: { title: string; hasFeed?: boolean } =
    $props();

  const { current } = useDiscover();
  const { current: episodeType, isApplicable } = useEpisodeType();
  const isDocked = useIsCalendarDocked();
</script>

{#snippet titleActions()}
  <CalendarTitleActions {hasFeed} />
{/snippet}

<NavbarStateSetter
  mode={$isDocked ? "minimal" : "full"}
  hasFilters
  showFilters={!$isDocked}
  header={{
    title,
    metaInfo: $isApplicable ? $episodeType.text() : $current.text(),
    actions: $isDocked ? undefined : titleActions,
  }}
/>
