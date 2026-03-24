<script lang="ts">
  import { m } from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import MediaWatchHistoryPaginatedList from "$lib/sections/lists/history/MediaWatchHistoryPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
  import { useMovie } from "../../../movies/[slug]/useMovie";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { movie } = $derived(useMovie(params.slug));
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_history()}
>
  <NavbarStateSetter mode="minimal" />
  <TraktPageCoverSetter />

  {#if $movie}
    <MediaWatchHistoryPaginatedList type="movie" media={$movie} />
  {/if}
</TraktPage>
