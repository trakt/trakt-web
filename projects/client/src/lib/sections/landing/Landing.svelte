<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Steps from "./components/Steps.svelte";
  import TrendingItems from "./components/TrendingItems.svelte";
</script>

<div
  class="trakt-landing-container"
  data-dpad-navigation={DpadNavigationType.List}
>
  <Steps />
  <!-- TODO: responsive design -->
  <RenderFor device={["desktop"]} audience="public">
    <TrendingItems />
  </RenderFor>
</div>

<style>
  .trakt-landing-container {
    width: calc(
      100dvw - 2 * var(--layout-distance-side) - var(--layout-sidebar-distance)
    );
    position: relative;
    margin-left: var(--layout-distance-side);
    padding: var(--ni-16);
    box-sizing: border-box;

    display: grid;
    grid-template-columns: auto 1fr;
  }
</style>
