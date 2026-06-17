<script lang="ts">
  import { page } from "$app/state";
  import type { Genre } from "@trakt/api";
  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import GenrePillCarousel from "$lib/sections/discover/GenrePillCarousel.svelte";
  import type { FilterOverrideParams } from "$lib/requests/models/FilterParams.ts";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import AnticipatedList from "$lib/sections/lists/anticipated/AnticipatedList.svelte";
  import PopularList from "$lib/sections/lists/popular/PopularList.svelte";
  import RecommendedList from "$lib/sections/lists/recommended/RecommendedList.svelte";
  import TrendingList from "$lib/sections/lists/trending/TrendingList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";

  const { mode: type } = useDiscover();

  const genre = $derived(page.params.genre as Genre);
  const genreLabel = $derived(toTranslatedGenre(genre));

  const genreFilter = $derived<FilterOverrideParams>({
    movie: { genres: genre },
    show: { genres: genre },
  });
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_SHOW_COVER} title={genreLabel}>
  <NavbarStateSetter hasFilters={false}>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>

  <TraktPageCoverSetter />

  <GenrePillCarousel activeGenre={genre} />

  <TrendingList
    title={m.list_title_trending()}
    drilldownLabel={$type === "show"
      ? m.button_label_view_all_trending_shows()
      : m.button_label_view_all_trending_movies()}
    type={$type}
    filterOverride={genreFilter}
  />

  <RenderFor audience="authenticated">
    <RecommendedList
      title={m.list_title_recommended()}
      drilldownLabel={$type === "show"
        ? m.button_label_view_all_recommended_shows()
        : m.button_label_view_all_recommended_movies()}
      type={$type}
      filterOverride={genreFilter}
    />
  </RenderFor>

  <PopularList
    title={m.list_title_most_popular()}
    drilldownLabel={$type === "show"
      ? m.button_label_view_all_popular_shows()
      : m.button_label_view_all_popular_movies()}
    type={$type}
    filterOverride={genreFilter}
  />

  <AnticipatedList
    title={m.list_title_most_anticipated()}
    drilldownLabel={$type === "show"
      ? m.button_label_view_all_anticipated_shows()
      : m.button_label_view_all_anticipated_movies()}
    type={$type}
    filterOverride={genreFilter}
  />
</TraktPage>
