<script lang="ts">
  import { page } from "$app/state";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import LibraryListPaginated from "$lib/sections/lists/library/LibraryListPaginated.svelte";
  import type { Library } from "$lib/sections/lists/library/models/Library";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const library: Library = $derived(
    page.url.searchParams.get("library") === "other" ? "other" : "plex",
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
    <RenderFor audience="authenticated">
      <NavbarStateSetter mode="minimal" />
    </RenderFor>

    <TraktPageCoverSetter />

    <LibraryListPaginated {library} />
  </TraktPage>
{/if}
