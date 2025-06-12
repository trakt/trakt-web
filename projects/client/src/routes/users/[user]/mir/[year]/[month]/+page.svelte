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
  title={m.month_in_review_label()}
>
  <TraktPageCoverSetter />

  <Frame
    slug={page.params.user}
    urlBuilder={(slug: string, token: string | Nil) => {
      return UrlBuilder.og.frame.monthInReview(
        slug,
        page.params.year,
        page.params.month,
        token,
      );
    }}
    title={m.month_in_review_label()}
  />
</TraktPage>
