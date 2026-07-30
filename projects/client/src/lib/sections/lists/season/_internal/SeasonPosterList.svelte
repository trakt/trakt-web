<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { m } from "$lib/features/i18n/messages";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { hasSeasonTitles } from "$lib/utils/media/hasSeasonTitles.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SeasonPosterItem from "./SeasonPosterItem.svelte";

  type SeasonListProps = {
    show: ShowEntry;
    seasons: Season[];
    title: string;
    subtitle: string;
    currentSeason: number;
  };

  const {
    show,
    seasons,
    title,
    subtitle,
    currentSeason,
  }: SeasonListProps = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();

  const hasTitles = $derived(hasSeasonTitles(seasons));
</script>

<SectionList
  {title}
  {subtitle}
  id={{
    scope: "season-poster-list",
    key: show.slug,
  }}
  items={seasons}
  drilldown={{
    ...buildDrawerLink(SummaryDrawers.Seasons),
    source: { id: "seasons" },
    label: m.button_text_view_all(),
  }}
  --height-list={hasTitles
    ? "var(--height-poster-list)"
    : "var(--height-poster-list-sm)"}
  --height-override-card={hasTitles
    ? "var(--height-portrait-card)"
    : "var(--height-portrait-card-sm)"}
>
  {#snippet item(season)}
    <SeasonPosterItem
      {show}
      {season}
      isCurrentSeason={season.number === currentSeason}
      urlBuilder={() => UrlBuilder.show(show.slug, { season: season.number })}
    />
  {/snippet}
</SectionList>
