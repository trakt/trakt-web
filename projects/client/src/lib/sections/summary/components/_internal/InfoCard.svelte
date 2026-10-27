<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";

  type InfoCardProps = {
    variant?: "default" | "highlight" | "dashed";
    size?: "default" | "compact";
  } & ChildrenProps;

  const {
    children,
    variant = "default",
    size = "default",
  }: InfoCardProps = $props();
</script>

<Card variant="transparent" --width-card="100%" --height-card="fit-content">
  <div class="trakt-info-container" data-variant={variant} data-size={size}>
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

    background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);
    border-radius: var(--border-radius-m);

    :global(.trakt-spoiler) {
      cursor: pointer;
    }

    :global(li) {
      font-size: var(--font-size-text);
    }

    &[data-size="compact"] {
      gap: var(--ni-10);
      padding: var(--ni-14);
    }

    &[data-variant="dashed"] {
      background: transparent;
      border: var(--border-thickness-xxs) dashed
        color-mix(in srgb, var(--color-vip-border-accent) 50%, transparent);
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
        animation: slide calc(5 * var(--transition-increment)) ease-in-out;
      }
    }
  }
</style>
