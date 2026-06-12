<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card variant="transparent" --width-card="100%" --height-card="fit-content">
  <div class="trakt-info-container">
    {@render children()}
  </div>
</Card>

<style>
  .trakt-info-container {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    box-sizing: border-box;
    padding: var(--ni-20) var(--ni-24);

    background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 24%, transparent);
    border-radius: var(--border-radius-m);

    :global(.trakt-spoiler) {
      cursor: pointer;
    }

    :global(li) {
      font-size: var(--font-size-text);
    }
  }
</style>
