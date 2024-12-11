<script>
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RecommendedShows from "$lib/sections/recommendations/RecommendedShows.svelte";
  import TrendingShows from "$lib/sections/trending/TrendingShows.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";

  const { user } = useUser();
</script>

<div class="trakt-shows">
  <RenderFor audience="authenticated">
    <BackgroundCoverImage src={$user?.cover.url ?? DEFAULT_COVER} type="main" />
    <TrendingShows />
    <RecommendedShows title={m.your_recommendations()} />
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
