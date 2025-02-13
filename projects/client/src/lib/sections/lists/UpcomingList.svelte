<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import EpisodeCard from "./components/EpisodeCard.svelte";
  import FindShowsLink from "./components/FindShowsLink.svelte";
  import { useCalendarEpisodes } from "./stores/useCalendarEpisodes";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { calendar, isLoading } = useCalendarEpisodes();
</script>

<SectionList
  id="upcoming-list"
  items={$calendar}
  title={m.upcoming_schedule_title()}
  --height-list={mediaListHeightResolver("episode")}
>
  {#snippet item(entry)}
    <EpisodeCard episode={entry} show={entry.show} variant="upcoming" />
  {/snippet}
  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.upcoming_schedule_empty()}</p>
      <FindShowsLink />
    {/if}
  {/snippet}
</SectionList>
