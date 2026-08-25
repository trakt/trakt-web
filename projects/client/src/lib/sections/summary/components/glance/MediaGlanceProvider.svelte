<script lang="ts">
  import { page } from "$app/state";
  import MediaGlanceDrawerHost from "./MediaGlanceDrawerHost.svelte";
  import { MediaGlanceDrawers } from "./MediaGlanceDrawers.ts";
  import { mediaGlanceNavigation } from "./mediaGlanceNavigation.ts";

  const { drawer, type, slug, close } = $derived(
    mediaGlanceNavigation(page.url.searchParams),
  );
</script>

{#if drawer === MediaGlanceDrawers.Media && type && slug}
  <MediaGlanceDrawerHost {type} {slug} onClose={close} />
{/if}
