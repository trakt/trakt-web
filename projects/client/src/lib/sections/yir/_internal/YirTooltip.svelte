<script lang="ts">
  const {
    main,
    sub,
    extra,
  }: {
    main: string;
    sub?: string;
    extra?: string;
  } = $props();
</script>

<div class="trakt-yir-tooltip">
  <div class="yir-tooltip-main">{main}</div>
  {#if sub}
    <div class="yir-tooltip-sub">{sub}</div>
  {/if}
  {#if extra}
    <div class="yir-tooltip-extra">{extra}</div>
  {/if}
</div>

<style lang="scss">
  // Styles are :global so the same classes can be reused by Carbon's
  // tooltip customHTML callback (see yirTooltipHTML.ts), which renders
  // outside this component's DOM.
  :global(.trakt-yir-tooltip) {
    background: var(--color-yir-tooltip-background);
    border: var(--border-thickness-xxs) solid var(--color-yir-separator);
    border-radius: var(--border-radius-xs);
    padding: var(--ni-8) var(--ni-12);
    color: var(--color-yir-text-primary);
    font-family: inherit;
    box-shadow: 0 var(--ni-2) var(--ni-8) var(--color-yir-scrim);
    text-align: center;
    white-space: nowrap;
  }

  :global(.yir-tooltip-main) {
    font-size: var(--font-size-text);
    font-weight: 600;
    color: var(--color-yir-text-primary);

    &:not(:last-child) {
      margin-bottom: var(--ni-4);
    }
  }

  :global(.yir-tooltip-sub),
  :global(.yir-tooltip-extra) {
    font-size: var(--ni-12);
    color: var(--color-yir-text-muted);
  }
</style>
