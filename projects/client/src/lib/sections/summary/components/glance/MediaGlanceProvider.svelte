<script lang="ts">
  import { page } from "$app/state";
  import { MediaGlanceDrawers } from "./MediaGlanceDrawers.ts";
  import { mediaGlanceNavigation } from "./mediaGlanceNavigation.ts";

  const { drawer, type, slug, season, episode, close } = $derived(
    mediaGlanceNavigation(page.url.searchParams),
  );
</script>

{#if slug}
  {#if drawer === MediaGlanceDrawers.Media && type}
    {#await import("./MediaGlanceDrawerHost.svelte") then { default: MediaGlanceDrawerHost }}
      <MediaGlanceDrawerHost {type} {slug} onClose={close} />
    {/await}
  {:else if drawer === MediaGlanceDrawers.Episode && season != null && episode != null}
    {#await import("../episode-drawer/EpisodeDrawerHost.svelte") then { default: EpisodeDrawerHost }}
      <EpisodeDrawerHost
        {slug}
        {season}
        {episode}
        variant="glance"
        onClose={close}
      />
    {/await}
  {:else if drawer === MediaGlanceDrawers.Season && season != null}
    {#await import("./_internal/SeasonGlanceHost.svelte") then { default: SeasonGlanceHost }}
      <SeasonGlanceHost {slug} {season} onClose={close} />
    {/await}
  {/if}
{/if}
