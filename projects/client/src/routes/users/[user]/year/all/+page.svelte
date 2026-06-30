<script lang="ts">
  import Frame from "$lib/components/frame/Frame.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import YirPage from "$lib/sections/yir/YirPage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { isMe } = $derived(useIsMe(params.user));
  const audience = $derived($isMe ? "authenticated" : "all");

  const pageTitle = $derived(m.page_title_all_time_stats());
  const pageImage = $derived(
    params.user === "me"
      ? undefined
      : UrlBuilder.og.widgets.yir(params.user, "all"),
  );
</script>

<TraktPage {audience} image={pageImage} title={pageTitle} mode="content-only">
  <NavbarStateSetter mode="minimal" sidebar={{ mode: "fixed" }} />

  <TraktPageCoverSetter />

  <RenderForFeature flag={FeatureFlag.YearInReview}>
    {#snippet enabled()}
      <YirPage slug={params.user} year="all" />
    {/snippet}

    <Frame
      slug={params.user}
      urlBuilder={(slug: string, token: string | Nil) => {
        return UrlBuilder.og.frame.yearToDate(slug, "all", token);
      }}
      title={pageTitle}
      mode="cover"
      source="yir"
    />
  </RenderForFeature>
</TraktPage>
