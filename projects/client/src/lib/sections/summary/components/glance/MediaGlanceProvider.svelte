<script lang="ts">
  import { page } from "$app/state";
  import EpisodeDrawerHost from "../episode-drawer/EpisodeDrawerHost.svelte";
  import SeasonGlanceHost from "./_internal/SeasonGlanceHost.svelte";
  import MediaGlanceDrawerHost from "./MediaGlanceDrawerHost.svelte";
  import { MediaGlanceDrawers } from "./MediaGlanceDrawers.ts";
  import { mediaGlanceNavigation } from "./mediaGlanceNavigation.ts";

  const { drawer, type, slug, season, episode, close } = $derived(
    mediaGlanceNavigation(page.url.searchParams),
  );
</script>

{#if slug}
  {#if drawer === MediaGlanceDrawers.Media && type}
    <MediaGlanceDrawerHost {type} {slug} onClose={close} />
  {:else if drawer === MediaGlanceDrawers.Episode && season != null && episode != null}
    <EpisodeDrawerHost
      {slug}
      {season}
      {episode}
      variant="glance"
      onClose={close}
    />
  {:else if drawer === MediaGlanceDrawers.Season && season != null}
    <SeasonGlanceHost {slug} {season} onClose={close} />
  {/if}
{/if}
