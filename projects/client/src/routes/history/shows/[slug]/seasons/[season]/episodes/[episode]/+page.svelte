<script lang="ts">
  import { m } from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import MediaWatchHistoryPaginatedList from "$lib/sections/lists/history/MediaWatchHistoryPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
  import { useEpisode } from "../../../../../../../shows/[slug]/seasons/[season]/episodes/[episode]/useEpisode";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { episode } = $derived(
    useEpisode({
      slug: params.slug,
      season: parseInt(params.season),
      episode: parseInt(params.episode),
    }),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_history()}
>
  <NavbarStateSetter mode="minimal" />
  <TraktPageCoverSetter />

  {#if $episode}
    <MediaWatchHistoryPaginatedList type="episode" media={$episode} />
  {/if}
</TraktPage>
