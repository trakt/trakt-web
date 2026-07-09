<script>
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import RecommendedPaginatedList from "$lib/sections/lists/recommended/RecommendedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";

  const { mode, current } = useDiscover();

  const {
    current: recommendation,
    set: setRecommendation,
    options: recommendationOptions,
  } = useToggler("recommendation");
</script>

{#snippet actions()}
  <RenderForFeature flag={FeatureFlag.SmartRecommendations}>
    {#snippet enabled()}
      <Toggler
        value={$recommendation.value}
        onChange={setRecommendation}
        options={recommendationOptions}
        variant="icon"
      />
    {/snippet}
  </RenderForFeature>
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_recommended_media()}
>
  <NavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_recommended(),
      metaInfo: $current.text(),
      actions,
    }}
  />
  <TraktPageCoverSetter />

  <RecommendedPaginatedList type={$mode} />
</TraktPage>
