<script lang="ts">
  import Frame from "$lib/components/frame/Frame.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const audience = $derived(params.user === "me" ? "authenticated" : "all");
</script>

<TraktPage
  {audience}
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_month_in_review()}
  mode="content-only"
>
  <NavbarStateSetter mode="minimal" />

  <TraktPageCoverSetter />

  <Frame
    slug={params.user}
    urlBuilder={(slug: string, token: string | Nil) => {
      return UrlBuilder.og.frame.monthInReview(
        slug,
        params.year,
        params.month,
        token,
      );
    }}
    title={m.page_title_month_in_review()}
    mode="cover"
  />
</TraktPage>
