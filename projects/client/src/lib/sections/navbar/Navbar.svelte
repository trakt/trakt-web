<script lang="ts">
  import SideNavbar from "./components/SideNavbar.svelte";
  import TopNavbar from "./components/TopNavbar.svelte";
  import { useNavbarType } from "./useNavbarType";

  const { navbarType } = useNavbarType();
</script>

{#if $navbarType === "side"}
  <SideNavbar />
{:else}
  <TopNavbar />
{/if}
