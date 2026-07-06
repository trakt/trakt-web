<script lang="ts">
  import Frame from "$lib/components/frame/Frame.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useWebviewSession } from "$lib/features/webview/useWebviewSession";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import YirPage from "$lib/sections/yir/YirPage.svelte";
  import type { YirYear } from "$lib/requests/models/YirYear";
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

  const now = new Date();
  const month = now.getMonth();
  // "all" and concrete years share this route so the header persists across
  // the whole period nav loop without remounting.
  const isAllTime = $derived(params.year === "all");
  const year = $derived<YirYear>(isAllTime ? "all" : Number(params.year));

  const isCurrentYear = $derived(!isAllTime && year === now.getFullYear());
  const isYtd = $derived(isCurrentYear && month > 0 && month < 11);

  const pageTitle = $derived(
    isAllTime
      ? m.page_title_all_time_stats()
      : isYtd
        ? m.page_title_year_to_date()
        : m.page_title_year_in_review({ year: params.year }),
  );
  const pageImage = $derived(
    params.user === "me"
      ? undefined
      : UrlBuilder.og.widgets.yir(params.user, params.year),
  );
</script>

<TraktPage {audience} image={pageImage} title={pageTitle} mode="content-only">
  <NavbarStateSetter mode={navbarMode} sidebar={{ mode: "fixed" }} />

  <TraktPageCoverSetter />

  {#if webview.slurm}
    <YirPage slug={params.user} {year} />
  {:else}
    <RenderForFeature flag={FeatureFlag.YearInReview}>
      {#snippet enabled()}
        <YirPage slug={params.user} {year} />
      {/snippet}

      <Frame
        slug={params.user}
        urlBuilder={(slug: string, token: string | Nil) => {
          return UrlBuilder.og.frame.yearToDate(slug, params.year, token);
        }}
        title={pageTitle}
        mode="cover"
        source="yir"
      />
    </RenderForFeature>
  {/if}
</TraktPage>
