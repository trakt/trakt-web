<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import AnticipatedList from "$lib/sections/lists/anticipated/AnticipatedList.svelte";
  import PopularList from "$lib/sections/lists/PopularList.svelte";
  import RecommendedList from "$lib/sections/lists/RecommendedList.svelte";
  import TrendingList from "$lib/sections/lists/TrendingList.svelte";
  import {
    DEFAULT_COVER,
    DEFAULT_SHARE_MOVIE_COVER,
  } from "$lib/utils/constants";

  const { current } = useUser();

  const type = "movie";

  type MovieContentProps = {
    cover: { url: string };
    isAuthorized: boolean;
  };
</script>

{#snippet content({ cover: { url }, isAuthorized }: MovieContentProps)}
  <CoverImageSetter src={url} type="main" />
  <TrendingList
    title={m.trending_now()}
    drilldownLabel={m.view_all_trending_movies()}
    {type}
  />
  {#if isAuthorized}
    <RecommendedList
      drilldownLabel={m.view_all_recommended_movies()}
      title={m.your_recommendations()}
      {type}
    />
  {/if}
  <AnticipatedList
    drilldownLabel={m.view_all_anticipated_movies()}
    title={m.most_anticipated()}
    {type}
  />
  <PopularList
    drilldownLabel={m.view_all_popular_movies()}
    title={m.most_popular()}
    {type}
  />
{/snippet}

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.navbar_link_movies()}
>
  <RenderFor audience="authenticated">
    {@render content({
      ...current(),
      isAuthorized: true,
    })}
  </RenderFor>

  <RenderFor audience="public">
    {@render content({
      cover: { url: DEFAULT_COVER },
      isAuthorized: false,
    })}
  </RenderFor>
</TraktPage>
