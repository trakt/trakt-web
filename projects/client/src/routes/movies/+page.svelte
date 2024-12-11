<script>
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import AnticipatedMovies from "$lib/sections/anticipated/AnticipatedMovies.svelte";
  import PopularMovies from "$lib/sections/popular/PopularMovies.svelte";
  import RecommendedMovies from "$lib/sections/recommendations/RecommendedMovies.svelte";
  import TrendingMovies from "$lib/sections/trending/TrendingMovies.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";

  const { user } = useUser();
</script>

<div class="trakt-shows">
  <RenderFor audience="authenticated">
    <BackgroundCoverImage src={$user?.cover.url ?? DEFAULT_COVER} type="main" />
    <TrendingMovies />
    <RecommendedMovies title={m.your_recommendations()} />
    <AnticipatedMovies />
    <PopularMovies />
  </RenderFor>
</div>

<style>
  .trakt-shows {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);

    inset: 0;
    margin: auto;
  }
</style>
