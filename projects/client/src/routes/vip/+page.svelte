<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import ManageSubscription from "$lib/sections/vip/ManageSubscription.svelte";
  import VipUpsellContent from "$lib/sections/vip/VipUpsellContent.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<RenderForFeature flag={FeatureFlag.VipPage}>
  {#snippet enabled()}
    <TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title="VIP">
      <NavbarStateSetter mode="minimal" />

      <RenderFor audience="free">
        <VipUpsellContent />
      </RenderFor>

      <RenderFor audience="vip">
        <ManageSubscription />
      </RenderFor>
    </TraktPage>
  {/snippet}

  <Redirect to={UrlBuilder.home()} />
</RenderForFeature>
