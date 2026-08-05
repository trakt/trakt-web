<script lang="ts">
  import CollapseIcon from "$lib/components/lists/section-list/CollapseIcon.svelte";
  import { useStreamingServiceLogo } from "$lib/components/media/streaming-service/useStreamingServiceLogo";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";
  import { getCostType } from "./getCostType";
  import { getMediaCost } from "./getMediaCost";
  import type { WhereToWatchServiceSectionProps } from "./models/WhereToWatchServiceSectionProps";
  import { toCountryFlag } from "./toCountryFlag";
  import WhereToWatchCountryTile from "./WhereToWatchCountryTile.svelte";
  import WhereToWatchLogo from "./WhereToWatchLogo.svelte";
  import WhereToWatchServiceLink from "./WhereToWatchServiceLink.svelte";

  const PREVIEW_FLAG_LIMIT = 6;

  const { source, countries, group, userCountry, isSearching = false }:
    WhereToWatchServiceSectionProps = $props();

  // svelte-ignore state_referenced_locally
  const logo = useStreamingServiceLogo({ source });

  let isCollapsed = $derived(!isSearching);

  const displayName = $derived($logo?.name || source);
  const hasLogo = $derived(Boolean($logo?.url));
  const costType = $derived(getCostType(group));

  const featured = $derived(
    countries.find((entry) => entry.country === userCountry) ??
      (countries.length === 1 ? countries.at(0) : undefined),
  );
  const featuredCost = $derived(
    featured ? getMediaCost(featured.service, costType) : "",
  );
  const otherCountries = $derived(
    countries.filter((entry) => entry !== featured),
  );
  const isExpandable = $derived(otherCountries.length > 0);
  const previewCountries = $derived(
    featured ? [] : otherCountries.slice(0, PREVIEW_FLAG_LIMIT),
  );
  const hiddenCount = $derived(otherCountries.length - previewCountries.length);

  function toggle() {
    isCollapsed = !isCollapsed;
  }
</script>

{#snippet serviceLogo()}
  <span class="service-logo-box">
    {#if hasLogo}
      <WhereToWatchLogo {source} size="small" />
    {:else}
      <span class="service-logo-fallback bold">{displayName}</span>
    {/if}
  </span>
{/snippet}

{#snippet serviceInfo()}
  <span class="service-info">
    <span class="service-name bold ellipsis">{displayName}</span>

    {#if featured}
      <span class="service-location">
        <span class="service-flag">{toCountryFlag(featured.country)}</span>
        <span class="service-country ellipsis">{featured.countryName}</span>
        {#if featuredCost}
          <span class="service-cost">{featuredCost}</span>
        {/if}
      </span>
    {:else}
      <span class="service-flags">
        {#each previewCountries as entry (entry.key)}
          <span class="service-flag">{toCountryFlag(entry.country)}</span>
        {/each}
      </span>
    {/if}
  </span>
{/snippet}

{#snippet serviceToggle()}
  {#if hiddenCount > 0}
    <span class="service-hidden-count tag secondary">+{hiddenCount}</span>
  {/if}

  <CollapseIcon
    state={isCollapsed ? "collapsed" : "expanded"}
    variant="bare"
    size={20}
  />
{/snippet}

<div
  class="trakt-where-to-watch-service-section"
  class:is-expanded={!isCollapsed}
>
  {#if featured}
    <div class="service-header">
      <WhereToWatchServiceLink service={featured.service}>
        {@render serviceLogo()}
        {@render serviceInfo()}
      </WhereToWatchServiceLink>

      {#if isExpandable}
        <button
          type="button"
          class="service-toggle"
          aria-expanded={!isCollapsed}
          aria-label={m.button_label_toggle_streaming_countries({
            service: displayName,
          })}
          onclick={toggle}
        >
          {@render serviceToggle()}
        </button>
      {/if}
    </div>
  {:else}
    <button
      type="button"
      class="service-header"
      aria-expanded={!isCollapsed}
      aria-label={m.button_label_toggle_streaming_countries({
        service: displayName,
      })}
      onclick={toggle}
    >
      {@render serviceLogo()}
      {@render serviceInfo()}

      <span class="service-toggle">
        {@render serviceToggle()}
      </span>
    </button>
  {/if}

  {#if !isCollapsed && isExpandable}
    <div class="service-countries" transition:slide={{ duration: 150 }}>
      {#each otherCountries as entry (entry.key)}
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
  @use "$style/scss/mixins/index" as *;

  .trakt-where-to-watch-service-section {
    --service-logo-box-height: var(--ni-64);

    display: flex;
    flex-direction: column;

    overflow: hidden;

    background: var(--color-card-background);
    border-radius: var(--border-radius-m);
  }

  .service-header {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    width: 100%;
    min-height: calc(var(--service-logo-box-height) + 2 * var(--ni-8));
    padding: var(--ni-8);
    box-sizing: border-box;

    color: var(--color-text-primary);
    text-align: start;

    :global(.trakt-link) {
      flex: 1;
      min-width: 0;

      display: flex;
      align-items: center;
      gap: var(--gap-m);

      border-radius: var(--border-radius-m);

      text-decoration: none;
      color: var(--color-text-primary);

      transition: background-color var(--transition-increment) ease-in-out;

      @include for-mouse {
        &:hover {
          color: var(--color-text-primary);
          background-color: color-mix(
            in srgb,
            var(--color-foreground) 5%,
            transparent
          );
        }
      }
    }
  }

  button.service-header {
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 5%,
          transparent
        );
      }
    }
  }

  .service-toggle {
    flex-shrink: 0;
    align-self: stretch;

    display: flex;
    align-items: center;
    gap: var(--ni-4);

    min-height: var(--ni-40);
    padding-inline: var(--ni-8);
    border-radius: var(--border-radius-m);

    color: var(--color-text-secondary);
  }

  button.service-toggle {
    position: relative;

    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &::before {
      content: "";

      position: absolute;
      inset-block: var(--ni-8);
      inset-inline-start: calc(-1 * var(--gap-m) / 2);
      width: var(--ni-1);

      background-color: var(--color-border);
    }

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
      }
    }
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
  }

  .service-name {
    max-width: 100%;
    font-size: var(--ni-16);
    line-height: var(--ni-16);
    text-align: start;
  }

  .service-location {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    max-width: 100%;
    margin-block-start: var(--ni-6);

    color: var(--color-text-secondary);
  }

  .service-country {
    min-width: 0;
  }

  .service-cost {
    flex-shrink: 0;

    &::before {
      content: "•";
      margin-inline-end: var(--gap-xs);
    }
  }

  .service-hidden-count {
    flex-shrink: 0;
  }

  .service-flags {
    display: flex;
    align-items: center;
    gap: var(--ni-4);

    max-width: 100%;
    overflow: hidden;

    margin-block-start: var(--ni-6);
    max-block-size: var(--ni-16);

    transition: var(--transition-increment) ease-in-out;
    transition-property: max-block-size, margin-block-start, opacity;
  }

  .trakt-where-to-watch-service-section.is-expanded .service-flags {
    margin-block-start: 0;
    max-block-size: 0;
    opacity: 0;
  }

  .service-flag {
    flex-shrink: 0;
    font-size: var(--ni-16);
    line-height: var(--ni-16);
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
