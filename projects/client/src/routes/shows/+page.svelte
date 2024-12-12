<script>
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import AnticipatedShows from "$lib/sections/anticipated/AnticipatedShows.svelte";
  import PopularShows from "$lib/sections/popular/PopularShows.svelte";
  import RecommendedShows from "$lib/sections/recommendations/RecommendedShows.svelte";
  import TrendingShows from "$lib/sections/trending/TrendingShows.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";

  const { current } = useUser();
</script>

<TraktPage title={m.navbar_link_shows()}>
  <RenderFor audience="authenticated">
    <BackgroundCoverImage src={current().cover.url} type="main" />
    <TrendingShows />
    <RecommendedShows title={m.your_recommendations()} />
    <AnticipatedShows />
    <PopularShows />
  </RenderFor>

  <RenderFor audience="public">
    <BackgroundCoverImage src={DEFAULT_COVER} type="main" />
    <TrendingShows />
    <AnticipatedShows />
    <PopularShows />
  </RenderFor>
</TraktPage>
