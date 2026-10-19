<script>
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import RecommendationModeToggles from "$lib/features/recommendations/RecommendationModeToggles.svelte";
  import { useRecommendationMode } from "$lib/features/recommendations/useRecommendationMode";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import RecommendedPaginatedList from "$lib/sections/lists/recommended/RecommendedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { ListTarget } from "$lib/sections/smart-lists/models/ListTarget";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";

  const { mode, current } = useDiscover();
  const { current: recommendationMode, isApplicable } = useRecommendationMode();

  const metaInfo = $derived(
    $isApplicable
      ? m.text_recommended_meta_info({
          media: $current.text(),
          mode: $recommendationMode.text(),
        })
      : $current.text(),
  );
</script>

{#snippet titleActions()}
  <RecommendationModeToggles />
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_recommended_media()}
>
  <NavbarStateSetter
    hasFilters
    smartListTarget={ListTarget.Recommendations}
    header={{
      title: m.list_title_recommended(),
      metaInfo,
      actions: titleActions,
    }}
  />
  <TraktPageCoverSetter />

  <RecommendedPaginatedList type={$mode} />
</TraktPage>
