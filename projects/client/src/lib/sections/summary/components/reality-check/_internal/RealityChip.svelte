<script lang="ts">
  import type { RealityChipProps } from "./RealityChipProps.ts";

  const { text, tone, muted = false }: RealityChipProps = $props();
</script>

<span class="trakt-reality-chip bold" data-tone={tone} class:is-muted={muted}>
  {text}
</span>

<style lang="scss">
  .trakt-reality-chip {
    flex-shrink: 0;
    padding: var(--ni-2) var(--ni-10);

    font-size: var(--font-size-tag);
    letter-spacing: 0.02em;
    text-transform: uppercase;
    white-space: nowrap;

    border-radius: var(--border-radius-xxl);

    &[data-tone="accurate"] {
      color: var(--color-reality-accurate-text);
      background: var(--color-reality-accurate-background);
    }

    &[data-tone="adjusted"] {
      color: var(--color-reality-adjusted-text);
      background: var(--color-reality-adjusted-background);
    }

    &[data-tone="altered"] {
      color: var(--color-reality-altered-text);
      background: var(--color-reality-altered-background);
    }

    &.is-muted {
      opacity: 0.75;
    }
  }
</style>
