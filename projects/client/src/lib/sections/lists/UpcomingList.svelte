<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import CalendarMediaCard from "$lib/features/calendar/CalendarMediaCard.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CalendarButton from "./components/CalendarButton.svelte";
  import CtaItem from "./components/cta/CtaItem.svelte";
  import EpisodeItem from "./components/EpisodeItem.svelte";
  import { useUpcomingItems } from "./stores/useUpcomingItems";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { upcoming, isLoading } = useUpcomingItems();
</script>

<SectionList
  id="upcoming-list"
  items={$upcoming}
  title={m.list_title_upcoming_schedule()}
  --height-list={mediaListHeightResolver("landscape")}
>
  {#snippet item(entry)}
    {#if "show" in entry}
      <EpisodeItem episode={entry} show={entry.show} variant="upcoming" />
    {/if}

    {#if entry.type === "movie"}
      <CalendarMediaCard media={entry} type="movie" />
    {/if}
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem cta={{ type: "upcoming" }} variant="card" />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <CtaItem cta={{ type: "upcoming" }} variant="placeholder" />
    {/if}
  {/snippet}

  {#snippet actions()}
    <CalendarButton />
  {/snippet}
</SectionList>
