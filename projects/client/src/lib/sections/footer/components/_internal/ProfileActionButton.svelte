<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import LogoutButton from "./LogoutButton.svelte";
  import SettingsButton from "./SettingsButton.svelte";

  const { size }: { size: "small" | "tag" } = $props();
</script>

<RenderFor
  navigation="default"
  audience="authenticated"
  device={["mobile", "tablet-sm"]}
>
  <SettingsButton {size} />
</RenderFor>

<RenderFor navigation="dpad" audience="authenticated">
  <LogoutButton {size} />
</RenderFor>
