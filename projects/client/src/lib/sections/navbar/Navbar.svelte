<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SideNavbar from "./components/SideNavbar.svelte";
  import TopNavbar from "./components/TopNavbar.svelte";
</script>

<RenderFor audience="all" device={["mobile", "tablet-sm"]} navigation="default">
  <TopNavbar />
</RenderFor>

<RenderFor
  audience="all"
  device={["desktop", "tablet-lg"]}
  navigation="default"
>
  <SideNavbar />
</RenderFor>

<RenderFor audience="all" navigation="dpad">
  <SideNavbar />
</RenderFor>
