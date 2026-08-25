<script lang="ts">
  import GlanceDrawer from "./GlanceDrawer.svelte";
  import SeasonGlance from "./SeasonGlance.svelte";

  const {
    slug,
    season,
    onClose,
  }: {
    slug: string;
    season: number;
    onClose: () => void;
  } = $props();
</script>

<GlanceDrawer classList="trakt-season-glance-drawer" {onClose}>
  <SeasonGlance {slug} {season} />
</GlanceDrawer>
