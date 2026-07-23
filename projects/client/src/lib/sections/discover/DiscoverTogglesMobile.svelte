<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DiscoverToggles from "./DiscoverToggles.svelte";

  // Small-screen counterpart of the persistent NavbarContentToggle: icon
  // squares with only the ACTIVE option labelled (selected-label). Fully
  // written-out labels were tried and reverted - narrow devices + verbose
  // locales + the page title competing for the header row degrade too easily.
</script>

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <DiscoverToggles />
</RenderFor>
