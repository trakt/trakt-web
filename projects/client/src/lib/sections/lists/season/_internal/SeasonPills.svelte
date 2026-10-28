<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    showSlug,
    seasons,
    currentSeason,
  }: {
    showSlug: string;
    seasons: Season[];
    currentSeason: number;
  } = $props();

  /* The section label already says "Seasons", so a pill only needs its number. */
  const options = $derived(
    seasons.map((season) => ({
      value: `${season.number}`,
      text:
        season.number === 0 ? m.text_season_specials() : `${season.number}`,
      label: seasonLabel(season.number),
    })),
  );

  /*
    Straight through goto, like the season dropdown: a link would pass the
    href through appendGlobalParameters, which rebuilds a same-page query from
    the live parameters and loses the season on the way. The page's other
    parameters (an open drawer, filters) ride along; the entry is replaced,
    not pushed, so flicking between seasons does not fill the back button.
  */
  const selectSeason = (season: string) =>
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(
      UrlBuilder.show(showSlug, {
        ...Object.fromEntries(page.url.searchParams),
        season,
      }),
      { noScroll: true, replaceState: true, keepFocus: true },
    );
</script>

<SegmentedSelect
  variant="selected-icon"
  style="pills"
  value={`${currentSeason}`}
  {options}
  ariaLabel={m.list_title_seasons()}
  onChange={selectSeason}
/>
