<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import CalendarTitleActions from "./CalendarTitleActions.svelte";
  import { useIsCalendarDocked } from "./useIsCalendarDocked";

  const { title, hasFeed = false }: { title: string; hasFeed?: boolean } =
    $props();

  const { current } = useDiscover();
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
    metaInfo: $current.text(),
    actions: $isDocked ? undefined : titleActions,
  }}
/>
