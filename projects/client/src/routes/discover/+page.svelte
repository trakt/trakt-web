<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import SeasonalToggle from "$lib/features/theme/components/SeasonalToggle.svelte";
  import { useSeasonalTheme } from "$lib/features/theme/useSeasonalTheme";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import AnticipatedList from "$lib/sections/lists/anticipated/AnticipatedList.svelte";
  import PopularList from "$lib/sections/lists/popular/PopularList.svelte";
  import RecommendedList from "$lib/sections/lists/recommended/RecommendedList.svelte";
  import TrendingList from "$lib/sections/lists/trending/TrendingList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";

  const { mode: type, useSeasonalFilters } = useDiscover();
  const { themeFilters } = useSeasonalTheme();

  const getThemeFilters = (id: string) => {
    if (!$useSeasonalFilters) {
      return;
    }

    return $themeFilters?.find((filter) => filter.id === id);
  };
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_discover()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter hasFilters={!$useSeasonalFilters}>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}

    {#snippet seasonalActions()}
      <SeasonalToggle />
    {/snippet}
  </NavbarStateSetter>

  <TrendingList
    title={m.list_title_trending()}
    drilldownLabel={$type === "show"
      ? m.button_label_view_all_trending_shows()
      : m.button_label_view_all_trending_movies()}
    type={$type}
    filterOverride={getThemeFilters("trending")}
  />
  <RenderFor audience="authenticated">
    <RecommendedList
      title={m.list_title_recommended()}
      drilldownLabel={$type === "show"
        ? m.button_label_view_all_recommended_shows()
        : m.button_label_view_all_recommended_movies()}
      type={$type}
      filterOverride={getThemeFilters("recommended")}
    />
  </RenderFor>
  <AnticipatedList
    drilldownLabel={$type === "show"
      ? m.button_label_view_all_anticipated_shows()
      : m.button_label_view_all_anticipated_movies()}
    title={m.list_title_most_anticipated()}
    type={$type}
    filterOverride={getThemeFilters("anticipated")}
  />
  <PopularList
    drilldownLabel={$type === "show"
      ? m.button_label_view_all_popular_shows()
      : m.button_label_view_all_popular_movies()}
    title={m.list_title_most_popular()}
    type={$type}
    filterOverride={getThemeFilters("popular")}
  />
</TraktPage>
