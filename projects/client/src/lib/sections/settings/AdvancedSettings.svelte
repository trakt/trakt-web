<script lang="ts">
  import SettingsFrame from "$lib/components/frame/SettingsFrame.svelte";
</script>

<div class="trakt-advanced-settings">
  <SettingsFrame />
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
