<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import AnticipatedList from "$lib/sections/lists/AnticipatedList.svelte";
  import PopularList from "$lib/sections/lists/PopularList.svelte";
  import RecommendedList from "$lib/sections/lists/RecommendedList.svelte";
  import TrendingList from "$lib/sections/lists/TrendingList.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";

  const { current } = useUser();

  const type = "show";

  type ShowContentProps = {
    cover: { url: string };
    isAuthorized: boolean;
  };
</script>

{#snippet content({ cover: { url }, isAuthorized }: ShowContentProps)}
  <BackgroundCoverImage src={url} type="main" />
  <TrendingList title={m.trending_now()} {type} />
  {#if isAuthorized}
    <RecommendedList title={m.your_recommendations()} {type} />
  {/if}
  <AnticipatedList title={m.most_anticipated()} {type} />
  <PopularList title={m.most_popular()} {type} />
{/snippet}

<TraktPage title={m.navbar_link_shows()}>
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
