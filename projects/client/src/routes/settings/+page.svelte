<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import GeneralSettings from "$lib/sections/settings/GeneralSettings.svelte";
  import SettingsHub from "$lib/sections/settings/SettingsHub.svelte";
</script>

<RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
  <GeneralSettings />
</RenderFor>

<RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
  <SettingsHub />
</RenderFor>
