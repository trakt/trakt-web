<script lang="ts">
  import CollapseIcon from "$lib/components/lists/section-list/CollapseIcon.svelte";
  import { useStreamingServiceLogo } from "$lib/components/media/streaming-service/useStreamingServiceLogo";
  import { slide } from "svelte/transition";
  import { getCostType } from "./getCostType";
  import type { WhereToWatchServiceSectionProps } from "./models/WhereToWatchServiceSectionProps";
  import { toCountryFlag } from "./toCountryFlag";
  import WhereToWatchCountryTile from "./WhereToWatchCountryTile.svelte";
  import WhereToWatchLogo from "./WhereToWatchLogo.svelte";

  const PREVIEW_FLAG_LIMIT = 6;

  const { source, countries, group, isSearching = false }:
    WhereToWatchServiceSectionProps = $props();

  // svelte-ignore state_referenced_locally
  const logo = useStreamingServiceLogo({ source });

  let isCollapsed = $state(true);

  // Force sections open while a search is active; collapse back to the default
  // state once the query is cleared. Manual toggles in between still apply.
  $effect(() => {
    isCollapsed = !isSearching;
  });

  const displayName = $derived($logo?.name || source);
  const hasLogo = $derived(Boolean($logo?.url));
  const costType = $derived(getCostType(group));
  const previewCountries = $derived(countries.slice(0, PREVIEW_FLAG_LIMIT));
  const hiddenCount = $derived(countries.length - previewCountries.length);
</script>

<div class="trakt-where-to-watch-service-section">
  <button
    type="button"
    class="service-header"
    aria-expanded={!isCollapsed}
    onclick={() => (isCollapsed = !isCollapsed)}
  >
    <span class="service-logo-box">
      {#if hasLogo}
        <WhereToWatchLogo {source} size="small" />
      {:else}
        <span class="service-logo-fallback bold">{displayName}</span>
      {/if}
    </span>

    <span class="service-info">
      <span class="service-name bold ellipsis">{displayName}</span>

      {#if isCollapsed}
        <span class="service-flags">
          {#each previewCountries as entry (entry.key)}
            <span class="service-flag">{toCountryFlag(entry.country)}</span>
          {/each}

          {#if hiddenCount > 0}
            <span class="service-flags-overflow tag secondary">
              +{hiddenCount}
            </span>
          {/if}
        </span>
      {/if}
    </span>

    <CollapseIcon state={isCollapsed ? "collapsed" : "expanded"} size={20} />
  </button>

  {#if !isCollapsed}
    <div class="service-countries" transition:slide={{ duration: 150 }}>
      {#each countries as entry (entry.key)}
        <WhereToWatchCountryTile
          service={entry.service}
          country={entry.country}
          countryName={entry.countryName}
          type={costType}
        />
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-where-to-watch-service-section {
    --service-logo-box-height: var(--ni-64);

    display: flex;
    flex-direction: column;

    overflow: hidden;

    background: var(--color-card-background);
    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-base);
  }

  .service-header {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    width: 100%;
    min-height: calc(var(--service-logo-box-height) + 2 * var(--ni-8));
    padding: var(--ni-8);
    padding-inline-end: var(--ni-12);
    box-sizing: border-box;

    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-primary);
    font: inherit;
    text-align: start;
  }

  .service-logo-box {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--service-logo-box-height);
    width: calc(var(--service-logo-box-height) * 6 / 5);
    padding: var(--ni-10);
    box-sizing: border-box;
    overflow: hidden;

    border: var(--ni-1) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);

    :global(.trakt-streaming-service-logo) {
      width: 100%;
      height: 100%;
    }
  }

  .service-logo-fallback {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;

    max-width: 100%;
    font-size: var(--ni-11);
    line-height: 1.1;
    text-align: center;
    text-transform: uppercase;
    color: var(--color-text-primary);
    overflow-wrap: break-word;
  }

  .service-info {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--ni-6);
  }

  .service-name {
    max-width: 100%;
    font-size: var(--ni-16);
    text-align: start;
  }

  .service-flags {
    display: flex;
    align-items: center;
    gap: var(--ni-4);

    max-width: 100%;
    overflow: hidden;
  }

  .service-flag {
    flex-shrink: 0;
    font-size: var(--ni-16);
    line-height: var(--ni-16);
  }

  .service-flags-overflow {
    flex-shrink: 0;
  }

  .service-countries {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-xs);

    padding-inline: var(--ni-8);
    padding-block-start: var(--ni-6);
    padding-block-end: var(--ni-8);
  }
</style>
