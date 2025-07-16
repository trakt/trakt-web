<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useNavbarType } from "$lib/sections/navbar/useNavbarType";
  import LogoutButton from "./LogoutButton.svelte";
  import SettingsButton from "./SettingsButton.svelte";

  const { size }: { size: "small" | "tag" } = $props();
  const { navbarType } = useNavbarType();
</script>

<RenderFor navigation="default" audience="authenticated">
  {#if $navbarType === "top"}
    <SettingsButton {size} />
  {/if}
</RenderFor>

<RenderFor navigation="dpad" audience="authenticated">
  <LogoutButton {size} />
</RenderFor>
