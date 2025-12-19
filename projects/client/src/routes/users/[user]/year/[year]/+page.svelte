<script lang="ts">
  import Frame from "$lib/components/frame/Frame.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { isMe } = $derived(useIsMe(params.user));
  const audience = $derived($isMe ? "authenticated" : "all");

  const now = new Date();
  const month = now.getMonth();
  const year = $derived(Number(params.year));

  const isCurrentYear = $derived(year === now.getFullYear());
  const isYtd = $derived(isCurrentYear && month > 0 && month < 11);

  const pageTitle = $derived(
    isYtd
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
  <NavbarStateSetter mode="minimal" />

  <TraktPageCoverSetter />

  <Frame
    slug={params.user}
    urlBuilder={(slug: string, token: string | Nil) => {
      return UrlBuilder.og.frame.yearToDate(slug, params.year, token);
    }}
    title={pageTitle}
    mode="cover"
    source="yir"
  />
</TraktPage>
