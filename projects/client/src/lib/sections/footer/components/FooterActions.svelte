<script>
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ExternalLinks from "./ExternalLinks.svelte";
</script>

<div class="trakt-footer-actions">
  <LocalePicker />
  <ThemePicker />
  <RenderFor device={["tablet-lg", "desktop"]} audience="all">
    <ExternalLinks />
  </RenderFor>
</div>

<style>
  .trakt-footer-actions {
    display: flex;
    align-items: center;

    :global(.trakt-external-links) {
      margin-left: var(--ni-80);
    }
  }
</style>
