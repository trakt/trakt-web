<script lang="ts">
  import type { MediaGlanceTarget } from "../MediaGlanceTarget.ts";
  import MovieGlance from "./MovieGlance.svelte";
  import ShowGlance from "./ShowGlance.svelte";

  const { type, slug }: MediaGlanceTarget = $props();
</script>

{#if type === "show"}
  <ShowGlance {slug} />
{:else}
  <MovieGlance {slug} />
{/if}
