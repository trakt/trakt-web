<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ManualCode from "./_internal/ManualCode.svelte";
  import QrCode from "./_internal/QrCode.svelte";
  import RetryAuth from "./_internal/RetryAuth.svelte";
  import { useAuthDevice } from "./_internal/useAuthDevice";

  const { authorization, activation } = useAuthDevice();
</script>

<RenderFor audience="authenticated">
  <Redirect to={UrlBuilder.home()} />
</RenderFor>

<TraktPage
  audience="public"
  title={m.page_title_sign_in()}
  image={DEFAULT_SHARE_COVER}
  --authentication-height="var(--ni-320)"
>
  <TraktPageCoverSetter />

  <div use:authorization class="trakt-authorization-container">
    {#if $activation.state === "failed"}
      <RetryAuth />
    {/if}

    {#if $activation.state === "polling"}
      <div class="trakt-authorization-codes">
        <QrCode
          data={`${$activation.url}/${$activation.code}`}
          --qr-code-size="var(--authentication-height)"
        />
        <ManualCode url={$activation.url} code={$activation.code} />
      </div>
    {/if}
  </div>
</TraktPage>

<style>
  .trakt-authorization-container {
    height: calc(100dvh - var(--content-gap));
    display: flex;
    justify-content: center;
  }

  .trakt-authorization-codes {
    display: flex;
    align-items: center;
    justify-content: center;

    gap: var(--gap-xl);
  }
</style>
