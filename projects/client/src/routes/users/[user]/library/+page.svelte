<script lang="ts">
  import { page } from "$app/state";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import LibraryToggler from "$lib/sections/lists/library/_internal/LibraryToggler.svelte";
  import LibraryListPaginated from "$lib/sections/lists/library/LibraryListPaginated.svelte";
  import type { Library } from "$lib/sections/lists/library/models/Library";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import { toTranslatedLibrary } from "$lib/utils/formatting/string/toTranslatedLibrary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const library: Library = $derived(
    page.url.searchParams.get("library") === "other" ? "other" : "plex",
  );

  const isMe = $derived(params.user === "me");
</script>

{#snippet actions()}
  <LibraryToggler value={library} withLinks />
{/snippet}

{#if !isMe}
  <Redirect to={UrlBuilder.home()} />
{:else}
  <TraktPage
    audience="authenticated"
    image={DEFAULT_SHARE_MOVIE_COVER}
    title={m.page_title_library()}
  >
    <ResponsiveNavbarStateSetter
      header={{
        title: m.list_title_library(),
        metaInfo: toTranslatedLibrary(library),
        actions,
      }}
    />

    <TraktPageCoverSetter />

    <LibraryListPaginated {library} />
  </TraktPage>
{/if}
