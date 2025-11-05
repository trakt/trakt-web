<script lang="ts">
  import { page } from "$app/state";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { CUSTOM_LIBRARY_NAME } from "$lib/sections/lists/library/constants";
  import LibraryListPaginated from "$lib/sections/lists/library/LibraryListPaginated.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const library = $derived(
    page.url.searchParams.get("library") ?? CUSTOM_LIBRARY_NAME,
  );

  const isMe = $derived(params.user === "me");
</script>

{#if !isMe}
  <Redirect to={UrlBuilder.home()} />
{:else}
  <TraktPage
    audience="authenticated"
    image={DEFAULT_SHARE_MOVIE_COVER}
    title={m.page_title_library()}
  >
    <TraktPageCoverSetter />

    <LibraryListPaginated {library} />
  </TraktPage>
{/if}
