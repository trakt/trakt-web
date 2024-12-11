<script>
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
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

<!-- TODO: @seferturan hide actions for unauthorized users -->
<div class="trakt-shows">
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
