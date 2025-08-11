<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CalendarButton from "./components/CalendarButton.svelte";
  import CtaItem from "./components/cta/CtaItem.svelte";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import EpisodeItem from "./components/EpisodeItem.svelte";
  import FindShowsLink from "./components/FindShowsLink.svelte";
  import { useUpcomingItems } from "./stores/useUpcomingItems";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { mode }: { mode: "episodes" | "all" } = $props();

  const { upcoming, isLoading } = useUpcomingItems(mode);
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
      <DefaultMediaItem media={entry} type="movie" variant="landscape" />
    {/if}
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem cta="upcoming" />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.list_placeholder_upcoming_schedule()}</p>
      <FindShowsLink />
    {/if}
  {/snippet}

  {#snippet actions()}
    {#if mode === "all"}
      <CalendarButton />
    {/if}
  {/snippet}
</SectionList>
