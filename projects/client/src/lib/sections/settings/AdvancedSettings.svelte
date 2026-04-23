<script lang="ts">
  import { page } from "$app/state";
  import SettingsFrame from "$lib/components/frame/SettingsFrame.svelte";

  const section = $derived(page.url.searchParams.get("section") ?? "");
</script>

<div class="trakt-advanced-settings">
  <SettingsFrame {section} />
</div>

<style>
  .trakt-advanced-settings {
    width: 100%;
    max-width: var(--ni-640);

    border-radius: var(--border-radius-l);
    overflow: hidden;

    background-color: var(--color-card-background);

    box-shadow: var(--shadow-base);
  }
</style>
