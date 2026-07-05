<script lang="ts">
  import { page } from "$app/state";
  import SettingsFrame from "$lib/components/frame/SettingsFrame.svelte";
  import DeleteAccount from "./_internal/DeleteAccount.svelte";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";

  const section = $derived(page.url.searchParams.get("section") ?? "");
</script>

<div class="trakt-advanced-settings-page">
  <SettingsGroupCard>
    <SettingsFrame {section} />
  </SettingsGroupCard>

  <DeleteAccount />
</div>

<style>
  .trakt-advanced-settings-page {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    width: 100%;
    max-width: var(--ni-640);
  }
</style>
