<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import SkeletonCard from "$lib/sections/lists/components/SkeletonCard.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";

  const {
    results,
    isLoading,
    pickTitles,
    titleOf,
    skipHref,
    changeHref,
    startOverHref,
    onResult,
  }: MixtapeResultsProps = $props();
</script>

<div class="trakt-mixtape-results">
  <p class="secondary">
    {m.text_mixtape_based_on({ titles: pickTitles.join(", ") })}
  </p>

  {#if isLoading}
    <div class="results-row">
      {#each [0, 1, 2] as index (index)}
        <SkeletonCard {index} listIndex={0} />
      {/each}
    </div>
  {:else if results.length === 0}
    <p class="secondary">{m.text_mixtape_results_empty()}</p>
  {:else}
    <div class="results-row">
      {#each results as { media, because }, position (media.key)}
        <div class="result">
          <DefaultMediaItem
            type={media.type}
            {media}
            onclick={() => onResult("open", position + 1)}
          />
          {#if titleOf(because)}
            <p class="small secondary">
              {m.text_mixtape_because({ title: titleOf(because) ?? "" })}
            </p>
          {/if}
          <div class="result-actions">
            <WatchlistAction
              style="normal"
              size="small"
              title={media.title}
              type={media.type}
              {media}
              onAdd={() => onResult("watchlist", position + 1)}
            />
            <Button
              href={skipHref(media.id)}
              noscroll
              replacestate
              size="small"
              style="ghost"
              variant="secondary"
              label={m.button_text_mixtape_not_this()}
              onclick={() => onResult("skip", position + 1)}
            >
              {m.button_text_mixtape_not_this()}
            </Button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div class="results-footer">
    <Button
      href={changeHref}
      noscroll
      size="small"
      style="ghost"
      variant="secondary"
      label={m.button_text_mixtape_change_picks()}
    >
      {m.button_text_mixtape_change_picks()}
    </Button>
    <Button
      href={startOverHref}
      noscroll
      size="small"
      variant="secondary"
      label={m.button_text_mixtape_start_over()}
    >
      {m.button_text_mixtape_start_over()}
    </Button>
  </div>
</div>

<style lang="scss">
  .trakt-mixtape-results {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    padding-inline: var(--layout-distance-side);

    .results-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xl);
    }

    .result {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      width: var(--width-portrait-card);
    }

    .result-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xs);
    }

    .results-footer {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-s);
    }
  }
</style>
