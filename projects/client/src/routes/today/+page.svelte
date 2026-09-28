<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import TodayOverview from "$lib/sections/today/TodayOverview.svelte";
  import TodayStoryViewerHost from "$lib/sections/today/TodayStoryViewerHost.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets.ts";

  const { mode, current } = useDiscover();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_today()}
  filterScope="global"
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    contentToggle="discover"
    hasFilters
    header={{
      title: m.page_title_today(),
      metaInfo: $current.text(),
    }}
  />

  <RenderForFeature flag={FeatureFlag.TodayStory}>
    {#snippet enabled()}
      <TodayOverview type={$mode} />
      <TodayStoryViewerHost />
    {/snippet}
  </RenderForFeature>
</TraktPage>
