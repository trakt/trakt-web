<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DiscoverBar from "../discover/DiscoverBar.svelte";
  import SideNavbar from "./components/SideNavbar.svelte";
  import TopNavbar from "./components/TopNavbar.svelte";
  import { NAVBAR_CONFIG } from "./constants";
</script>

<RenderFor audience="all" device={NAVBAR_CONFIG.top.device}>
  <TopNavbar />
</RenderFor>

<RenderFor audience="all" device={NAVBAR_CONFIG.side.device}>
  <DiscoverBar />
  <SideNavbar />
</RenderFor>
