<script lang="ts">
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";

  const {
    title,
    meta,
    tally,
    isWin,
  }: { title: string; meta?: string; tally: string; isWin: boolean } = $props();
</script>

<li class="trakt-award-group-header">
  <h3 class="bold">{title}</h3>
  {#if meta}
    <span class="group-meta small secondary ellipsis">{meta}</span>
  {/if}
  <span class="group-tally small" class:is-win={isWin}>
    <MessageWithBold message={tally} />
  </span>
</li>

<style lang="scss">
  .trakt-award-group-header {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
    min-width: 0;

    padding: var(--ni-14) var(--award-drawer-inset, 0) var(--ni-6);

    h3 {
      flex: none;
      font-size: var(--font-size-text);
    }

    .group-meta {
      min-width: 0;
    }

    .group-tally {
      flex: none;
      margin-inline-start: auto;
      color: var(--color-text-secondary);

      &.is-win :global(b) {
        color: var(--color-award-gold-text);
        font-weight: 600;
      }
    }
  }
</style>
