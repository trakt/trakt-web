<script>
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import AnticipatedMovies from "$lib/sections/anticipated/AnticipatedMovies.svelte";
  import PopularMovies from "$lib/sections/popular/PopularMovies.svelte";
  import RecommendedMovies from "$lib/sections/recommendations/RecommendedMovies.svelte";
  import TrendingMovies from "$lib/sections/trending/TrendingMovies.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";

  const { current } = useUser();
</script>

<TraktPage title={m.navbar_link_movies()}>
  <RenderFor audience="authenticated">
    <BackgroundCoverImage src={current().cover.url} type="main" />
    <TrendingMovies />
    <RecommendedMovies title={m.your_recommendations()} />
    <AnticipatedMovies />
    <PopularMovies />
  </RenderFor>

  <RenderFor audience="public">
    <BackgroundCoverImage src={DEFAULT_COVER} type="main" />
    <TrendingMovies />
    <AnticipatedMovies />
    <PopularMovies />
  </RenderFor>
</TraktPage>
