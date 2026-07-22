<script lang="ts">
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import { resolveContentToggle } from "./resolveContentToggle.ts";

  const config = $derived(resolveContentToggle(page.route.id, "small"));
</script>

{#if config}
  <RenderFor audience={config.audience}>
    <DiscoverToggles />
  </RenderFor>
{/if}
