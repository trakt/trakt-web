<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { Snippet } from "svelte";

  const {
    children,
    variant = "default",
  }: {
    children: Snippet;
    variant?: "default" | "official";
  } = $props();
</script>

<Card
  --width-card="min(var(--width-list-card), 85vw)"
  --height-card="var(--height-list-card)"
>
  <div class="trakt-list-summary-card" data-variant={variant}>
    {@render children()}
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-summary-card {
    height: var(--height-list-card);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-xs);

    padding: var(--ni-12);

    outline: var(--border-thickness-xs) solid transparent;
    transition: outline-color var(--transition-increment) ease-in-out;

    background-color: color-mix(
      in srgb,
      var(--color-card-background) 40%,
      var(--color-background)
    );
    border-radius: var(--border-radius-m);

    &[data-variant="official"] {
      background-color: color-mix(
        in srgb,
        var(--color-official-list-background) 40%,
        var(--color-background)
      );
    }
  }

  @include for-mouse() {
    :global(.trakt-card-content:hover) .trakt-list-summary-card {
      outline-color: var(--color-card-border-hover);
    }
  }
</style>
