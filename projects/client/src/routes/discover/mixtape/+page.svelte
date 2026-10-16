<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import Mixtape from "$lib/sections/mixtape/Mixtape.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { user } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_mixtape()}
>
  <NavbarStateSetter mode="minimal" />

  <RenderForFeature flag={FeatureFlag.Mixtape} audience="director">
    {#snippet enabled()}
      <Mixtape />
    {/snippet}

    {#if $user}
      <Redirect to={UrlBuilder.discover()} />
    {/if}
  </RenderForFeature>
</TraktPage>
