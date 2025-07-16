<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { NAVBAR_CONFIG } from "$lib/sections/navbar/constants";
  import LogoutButton from "./LogoutButton.svelte";
  import SettingsButton from "./SettingsButton.svelte";

  const { size }: { size: "small" | "tag" } = $props();
</script>

<RenderFor
  navigation="default"
  audience="authenticated"
  device={NAVBAR_CONFIG.top.device}
>
  <SettingsButton {size} />
</RenderFor>

<RenderFor navigation="dpad" audience="authenticated">
  <LogoutButton {size} />
</RenderFor>
