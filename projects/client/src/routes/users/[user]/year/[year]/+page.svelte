<script lang="ts">
  import { page } from "$app/state";
  import Frame from "$lib/components/frame/Frame.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const audience = $derived(
    page.params.user === "me" ? "authenticated" : "all",
  );
</script>

<TraktPage
  {audience}
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_year_to_date()}
>
  <TraktPageCoverSetter />

  <Frame
    slug={page.params.user}
    urlBuilder={(slug: string, token: string | Nil) => {
      return UrlBuilder.og.frame.yearToDate(slug, page.params.year, token);
    }}
    title={m.page_title_year_to_date()}
  />
</TraktPage>
