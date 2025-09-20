<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-summary-card-details">
  <div class="trakt-summary-card-titles">
    {@render children()}
  </div>
</div>

<style>
  .trakt-summary-card-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    flex-grow: 1;
    z-index: var(--layer-raised);

    overflow: hidden;

    padding: var(--ni-12);
    padding-top: var(--ni-10);

    .trakt-summary-card-titles {
      display: flex;
      flex-direction: column;
      gap: var(--gap-micro);
    }
  }
</style>
