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

<div class="yir-tooltip">
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
  :global(.yir-tooltip) {
    background: color-mix(in srgb, var(--shade-1000) 92%, transparent);
    border: var(--border-thickness-xxs) solid var(--shade-800);
    border-radius: var(--border-radius-xs);
    padding: var(--ni-8) var(--ni-12);
    color: var(--shade-10);
    font-family: inherit;
    box-shadow: 0 var(--ni-2) var(--ni-8)
      color-mix(in srgb, var(--shade-1000) 60%, transparent);
    text-align: center;
    white-space: nowrap;
  }

  :global(.yir-tooltip-main) {
    font-size: 14px;
    font-weight: 600;
    color: var(--shade-10);

    &:not(:last-child) {
      margin-bottom: var(--ni-4);
    }
  }

  :global(.yir-tooltip-sub),
  :global(.yir-tooltip-extra) {
    font-size: 11px;
    color: var(--shade-500);
  }
</style>
