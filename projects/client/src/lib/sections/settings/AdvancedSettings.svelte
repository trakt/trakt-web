<script lang="ts">
  import DeleteAccount from "./_internal/DeleteAccount.svelte";
</script>

<div class="trakt-advanced-settings-page">
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
