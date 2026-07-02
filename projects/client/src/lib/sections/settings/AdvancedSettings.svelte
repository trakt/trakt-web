<script lang="ts">
  import { page } from "$app/state";
  import SettingsFrame from "$lib/components/frame/SettingsFrame.svelte";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";

  const section = $derived(page.url.searchParams.get("section") ?? "");
</script>

<SettingsGroupCard>
  <SettingsFrame {section} />
</SettingsGroupCard>
