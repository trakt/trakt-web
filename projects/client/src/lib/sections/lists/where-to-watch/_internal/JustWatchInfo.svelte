<script lang="ts">
  import JustWatchIcon from "$lib/components/icons/JustWatchIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { StreamingRank } from "$lib/requests/models/StreamingServiceOptions";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { slide } from "svelte/transition";
  import { useJustWatchUrl } from "./useJustWatchUrl";

  const {
    rank,
    ...target
  }: {
    rank?: StreamingRank;
  } & MetaInfoProps = $props();

  const { country } = useStreamingPreferences();

  const { isLoading, url } = $derived(
    useJustWatchUrl({
      country: $country,
      ...target,
    }),
  );
</script>

{#if !$isLoading && $url}
  <div class="trakt-just-watch-info" transition:slide={{ duration: 150 }}>
    <Link href={$url} target="_blank">
      <div class="trakt-just-watch-logo">
        <JustWatchIcon />
        <p class="tiny">JustWatch</p>
      </div>
    </Link>

    {#if rank}
      <span>{rank.current}</span>
      <span
        class:is-positive={rank.current > 0}
        class:is-negative={rank.current < 0}
      >
        ({rank.delta})
      </span>
    {/if}
  </div>
{/if}

<style>
  .trakt-just-watch-info {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    .is-positive {
      color: var(--color-rank-positive);
    }

    .is-negative {
      color: var(--color-rank-negative);
    }

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
</style>
