<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";

  const { children, title }: ChildrenProps & { title: string } = $props();
</script>

<div class="trakt-summary-header">
  <div class="trakt-summary-header-children">
    {@render children()}
  </div>

  <ShareButton {title} />
</div>

<style>
  .trakt-summary-header {
    display: flex;
    align-items: flex-end;
    gap: var(--ni-8);
    justify-content: space-between;
  }

  .trakt-summary-header-children {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>
