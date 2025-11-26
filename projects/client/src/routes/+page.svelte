<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import Banner from "$lib/sections/banner/Banner.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import MobileLanding from "$lib/sections/landing/MobileLanding.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ActivityList from "$lib/sections/lists/activity/ActivityList.svelte";
  import PersonalHistoryList from "$lib/sections/lists/history/PersonalHistoryList.svelte";
  import UpNextList from "$lib/sections/lists/progress/UpNextList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  // FIXME: move to PersonalHistoryList when Profile also supports discover mode
  const { mode } = useDiscover();
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
  title={m.page_title_home()}
  type="home"
>
  <TraktPageCoverSetter />

  <RenderForFeature flag={FeatureFlag.HomeFilter}>
    {#snippet enabled()}
      {@render navbarState(true)}
    {/snippet}
    {@render navbarState(false)}
  </RenderForFeature>

  <Banner />
  <UpNextList intent="continue" />
  <UpNextList intent="start" />
  <UpcomingList />
  <PersonalHistoryList mode={$mode} />
  <ActivityList />
</TraktPage>

<RenderFor audience="public">
  <NavbarStateSetter mode="hidden" />

  <RenderFor audience="public" device={["tablet-sm", "tablet-lg", "desktop"]}>
    <Landing />
  </RenderFor>

  <RenderFor audience="public" device={["mobile"]}>
    <MobileLanding />
  </RenderFor>
</RenderFor>
