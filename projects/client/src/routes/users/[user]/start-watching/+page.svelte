<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UpNextPaginatedList from "$lib/sections/lists/progress/UpNextPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

{#snippet navbarState(hasFilters: boolean)}
  <NavbarStateSetter {hasFilters}>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_start_watching()}
>
  <TraktPageCoverSetter />

  <RenderForFeature flag={FeatureFlag.HomeFilter}>
    {#snippet enabled()}
      {@render navbarState(true)}
    {/snippet}
    {@render navbarState(false)}
  </RenderForFeature>

  <UpNextPaginatedList intent="start" />
</TraktPage>
