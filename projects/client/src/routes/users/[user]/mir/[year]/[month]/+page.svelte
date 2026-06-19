<script lang="ts">
  import Frame from "$lib/components/frame/Frame.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
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

  const year = $derived(Number(params.year));
  const month = $derived(Number(params.month));
</script>

<TraktPage
  {audience}
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_month_in_review()}
  mode="content-only"
>
  <NavbarStateSetter mode="minimal" sidebar={{ mode: "fixed" }} />

  <TraktPageCoverSetter />

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
</TraktPage>
