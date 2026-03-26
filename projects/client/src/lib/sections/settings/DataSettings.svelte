<script lang="ts">
  import RawExport from "./_internal/RawExport.svelte";
  import RawImport from "./_internal/RawImport.svelte";
</script>

<div class="trakt-data-settings">
  <RawImport />
  <RawExport />
</div>

<style>
  .trakt-data-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);
  }
</style>
