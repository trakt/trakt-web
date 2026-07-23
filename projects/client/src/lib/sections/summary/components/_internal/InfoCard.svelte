<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";

  type InfoCardProps = {
    variant?: "default" | "highlight";
  } & ChildrenProps;

  const { children, variant = "default" }: InfoCardProps = $props();
</script>

<Card variant="transparent" --width-card="100%" --height-card="fit-content">
  <div class="trakt-info-container" data-variant={variant}>
    {@render children()}
  </div>
</Card>

<style>
  .trakt-info-container {
    --border-opacity-info: 10%;

    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    box-sizing: border-box;
    padding: var(--ni-20) var(--ni-24);

    background: var(--color-subtle-surface-background);
    border-radius: var(--border-radius-m);

    :global(.trakt-spoiler) {
      cursor: pointer;
    }

    :global(li) {
      font-size: var(--font-size-text);
    }

    &[data-variant="highlight"] {
      --border-opacity-info: 25%;

      overflow: hidden;

      &::before {
        content: "";

        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;

        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--color-sentiment-highlight-border) 50%,
          transparent 100%
        );

        transform: translateX(-100%);
        animation: var(
          --animation-decorative,
          slide calc(5 * var(--transition-increment)) ease-in-out
        );
      }
    }
  }

  :global(:root[data-reduced-visual-noise])
    .trakt-info-container[data-variant="highlight"]::before {
    display: none;
  }
</style>
