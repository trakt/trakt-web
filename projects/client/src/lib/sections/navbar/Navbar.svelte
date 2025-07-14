<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SideNavbar from "./components/SideNavbar.svelte";
  import TopNavbar from "./components/TopNavbar.svelte";
</script>

<RenderFor audience="all" navigation="default">
  <TopNavbar />
</RenderFor>

<RenderFor audience="all" navigation="dpad">
  <SideNavbar />
</RenderFor>
