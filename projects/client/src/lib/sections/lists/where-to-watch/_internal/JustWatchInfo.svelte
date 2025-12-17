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

  const delta = $derived.by(() => {
    if (!rank?.delta) return null;

    const absDelta = Math.abs(rank.delta);
    return rank.delta > 0 ? `+${absDelta}` : `-${absDelta}`;
  });
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
      <span class="secondary tag"> {rank.current}</span>
      {#if delta}
        <span class="secondary tag">
          ({delta})
        </span>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .trakt-just-watch-info {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

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
