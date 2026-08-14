<script lang="ts">
  import { goto } from "$app/navigation";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { Season } from "$lib/requests/models/Season.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { SeasonDropdownProps } from "./SeasonDropdownProps.ts";

  const { showSlug, seasons, currentSeason, urlBuilder }: SeasonDropdownProps =
    $props();

  const buildUrl = $derived(
    urlBuilder ?? ((n: number) => UrlBuilder.show(showSlug, { season: n })),
  );

  const seasonText = (season: Season) => {
    const count = season.episodes.count;

    if (season.number === 0) {
      return m.text_season_specials_with_episodes({ count });
    }

    if (season.title) {
      return m.text_season_number_with_title_and_episodes({
        number: season.number,
        title: season.title,
        count,
      });
    }

    return m.text_season_number_with_episodes({
      number: season.number,
      count,
    });
  };

  const options = $derived(
    seasons.map((season) => ({
      value: `${season.number}`,
      label: seasonText(season),
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
