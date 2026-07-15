<script lang="ts">
  import { goto } from "$app/navigation";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { SeasonDropdownProps } from "./SeasonDropdownProps.ts";

  const { showSlug, seasons, currentSeason, urlBuilder }: SeasonDropdownProps =
    $props();

  const buildUrl = $derived(
    urlBuilder ?? ((n: number) => UrlBuilder.show(showSlug, { season: n })),
  );

  const seasonText = (seasonNumber: number) => {
    return seasonNumber === 0 ? m.text_season_specials() : `${seasonNumber}`;
  };

  const options = $derived(
    seasons.map((season) => ({
      value: `${season.number}`,
      label: seasonText(season.number),
    })),
  );

  const onSeasonChange = (value: string) => {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(buildUrl(Number(value)), { noScroll: true });
  };
</script>

<SingleSelect
  {options}
  value={`${currentSeason}`}
  placeholder={m.list_title_seasons()}
  disabled={seasons.length < 2}
  autoWidth
  onChange={onSeasonChange}
/>
