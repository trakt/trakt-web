<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import EpisodeItem from "./components/EpisodeItem.svelte";
  import FindShowsLink from "./components/FindShowsLink.svelte";
  import { useCalendarEpisodes } from "./stores/useCalendarEpisodes";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { calendar, isLoading } = useCalendarEpisodes();
</script>

<SectionList
  id="upcoming-list"
  items={$calendar}
  title={m.list_title_upcoming_schedule()}
  --height-list={mediaListHeightResolver("landscape")}
>
  {#snippet item(entry)}
    <EpisodeItem episode={entry} show={entry.show} variant="upcoming" />
  {/snippet}
  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.list_placeholder_upcoming_schedule()}</p>
      <FindShowsLink />
    {/if}
  {/snippet}
</SectionList>
