<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import TodayOverview from "$lib/sections/today/TodayOverview.svelte";
  import TodayStoryViewerHost from "$lib/sections/today/TodayStoryViewerHost.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets.ts";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_today()}
  filterScope="global"
>
  <TraktPageCoverSetter />

  <NavbarStateSetter mode="minimal" />

  <RenderForFeature flag={FeatureFlag.TodayStory}>
    {#snippet enabled()}
      <TodayOverview />
      <TodayStoryViewerHost />
    {/snippet}
  </RenderForFeature>
</TraktPage>
