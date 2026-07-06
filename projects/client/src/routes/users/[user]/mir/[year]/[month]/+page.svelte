<script lang="ts">
  import Frame from "$lib/components/frame/Frame.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useWebviewSession } from "$lib/features/webview/useWebviewSession";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import MirPage from "$lib/sections/yir/MirPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { isMe } = $derived(useIsMe(params.user));
  const audience = $derived($isMe ? "authenticated" : "all");

  // Captures the WebView params on entry, strips them from the URL, and exposes
  // them for the session. In standalone mode drop the app chrome so the page
  // reads as a native screen; otherwise keep the minimal navbar. When a slurm
  // token is present, render the native review directly (below): it authorizes
  // via the token and paints on the first frame, skipping the async
  // feature-flag/audience gate that would otherwise show the iframe first.
  const webview = useWebviewSession();
  const navbarMode = $derived(webview.isStandalone ? "hidden" : "minimal");

  const year = $derived(Number(params.year));
  const month = $derived(Number(params.month));
</script>

<TraktPage
  {audience}
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_month_in_review()}
  mode="content-only"
>
  <NavbarStateSetter mode={navbarMode} sidebar={{ mode: "fixed" }} />

  <TraktPageCoverSetter />

  {#if webview.slurm}
    <MirPage slug={params.user} {year} {month} />
  {:else}
    <RenderForFeature flag={FeatureFlag.MonthInReview}>
      {#snippet enabled()}
        <MirPage slug={params.user} {year} {month} />
      {/snippet}

      <Frame
        slug={params.user}
        urlBuilder={(slug, token) =>
          UrlBuilder.og.frame.monthInReview(
            slug,
            params.year,
            params.month,
            token,
          )}
        title={m.page_title_month_in_review()}
        mode="cover"
        source="mir"
      />
    </RenderForFeature>
  {/if}
</TraktPage>
