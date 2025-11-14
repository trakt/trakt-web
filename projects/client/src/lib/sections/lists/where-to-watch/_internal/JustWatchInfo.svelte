<script lang="ts">
  import JustWatchIcon from "$lib/components/icons/JustWatchIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";

  /*
    TODO:
    -add api support for watchnow/justwatch_links endpoint
    -justwatch rankings
   */

  const ranking = 15;
  const change = 976;

  const isPositive = $derived(change > 0);
  const isNegative = $derived(change < 0);
  const symbol = $derived(isPositive ? "+" : isNegative ? "-" : "");
</script>

<div class="trakt-just-watch-info">
  <Link href="https://www.justwatch.com/" target="_blank">
    <div class="trakt-just-watch-logo">
      <JustWatchIcon />
      <p class="tiny">JustWatch</p>
    </div>

    <p class="tiny">{ranking}</p>
    <p
      class="tiny trakt-just-watch-rank-change"
      class:is-positive={isPositive}
      class:is-negative={isNegative}
    >
      ({symbol}{change})
    </p>
  </Link>
</div>

<style>
  .trakt-just-watch-info {
    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      &:hover {
        color: var(--color-text-primary);
      }
    }
  }

  .trakt-just-watch-logo {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    color: var(--color-just-watch);
  }

  .trakt-just-watch-rank-change {
    &.is-negative {
      color: var(--red-600);
    }

    &.is-positive {
      color: var(--green-500);
    }
  }
</style>
