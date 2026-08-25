<script lang="ts">
  import GlanceDrawer from "./_internal/GlanceDrawer.svelte";
  import MediaGlance from "./_internal/MediaGlance.svelte";
  import type { MediaGlanceTarget } from "./MediaGlanceTarget.ts";

  const {
    onClose,
    ...target
  }: { onClose: () => void } & MediaGlanceTarget = $props();
</script>

<GlanceDrawer classList="trakt-media-glance-drawer" {onClose}>
  <MediaGlance {...target} />
</GlanceDrawer>
