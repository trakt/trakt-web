<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import VipCancel from "$lib/sections/vip/VipCancel.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { user } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_vip_cancel()}
>
  <NavbarStateSetter mode="minimal" />

  <RenderForFeature flag={FeatureFlag.VipCancelFlow} audience="director">
    {#snippet enabled()}
      <VipCancel />
    {/snippet}

    {#if $user}
      <Redirect to={UrlBuilder.vip()} />
    {/if}
  </RenderForFeature>
</TraktPage>
