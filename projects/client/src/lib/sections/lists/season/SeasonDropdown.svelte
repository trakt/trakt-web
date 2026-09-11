<script lang="ts">
  import { goto } from "$app/navigation";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { Season } from "$lib/requests/models/Season.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { SeasonDropdownProps } from "./SeasonDropdownProps.ts";

  const {
    showSlug,
    seasons,
    currentSeason,
    urlBuilder,
  }: SeasonDropdownProps = $props();

  const buildUrl = $derived(
    urlBuilder ?? ((n: number) => UrlBuilder.show(showSlug, { season: n })),
  );

  const seasonLabel = (season: Season) => {
    if (season.number === 0) return m.text_season_specials();

    if (season.title) {
      return m.text_season_number_with_title({
        number: season.number,
        title: season.title,
      });
    }

    return `${season.number}`;
  };

  const episodeCountByValue = $derived(
    new Map(
      seasons.map((season) => [`${season.number}`, season.episodes.count]),
    ),
  );

  const options = $derived(
    seasons.map((season) => ({
      value: `${season.number}`,
      label: seasonLabel(season),
      tag: episodeCountTag,
    })),
  );

  const onSeasonChange = (value: string) => {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(buildUrl(Number(value)), { noScroll: true });
  };
</script>

{#snippet episodeCountTag(option: SelectOption)}
  <EpisodeCountTag
    count={episodeCountByValue.get(option.value) ?? 0}
    i18n={TagIntlProvider}
    type="tag"
    variant="subtle"
  />
{/snippet}

<SingleSelect
  {options}
  value={`${currentSeason}`}
  placeholder={m.list_title_seasons()}
  disabled={seasons.length < 2}
  autoWidth
  onChange={onSeasonChange}
/>
