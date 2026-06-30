<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useParentalGuideCategories } from "../../_internal/useParentalGuideCategories.ts";

  const LOADING_ROWS = Array.from({ length: 5 });

  const { imdbId }: { imdbId?: string | null } = $props();

  const { categories, isError, isLoading } = useParentalGuideCategories({
    imdbId$: fromRune(() => imdbId),
  });

  const guideState = $derived.by(() => {
    if ($isLoading) {
      return "loading";
    }

    if ($isError) {
      return "error";
    }

    return $categories.length > 0 ? "ready" : "empty";
  });

  const guideNotice = $derived.by(() => {
    if (guideState === "error") {
      return {
        label: "Loading Error",
        severityTone: "severe",
      };
    }

    if (guideState === "empty") {
      return {
        label: m.text_unavailable(),
        severityTone: "none",
      };
    }

    return null;
  });
</script>

<section
  class="trakt-media-parental-guide"
  aria-busy={guideState === "loading"}
  data-state={guideState}
>
  <p class="bold secondary">
    {m.option_text_certification_parental_guidance()}
  </p>

  {#if guideState === "ready"}
    <ul class="guide-list">
      {#each $categories as category (category.key)}
        <li class="guide-row" data-severity={category.severityTone}>
          <span class="severity-rail" aria-hidden="true"></span>
          <span class="guide-copy">
            <span class="guide-label bold">{category.label}</span>
            <span class="guide-severity secondary">{category.severityLabel}</span>
          </span>
        </li>
      {/each}
    </ul>
  {:else if guideState === "loading"}
    <div class="guide-list" aria-hidden="true">
      {#each LOADING_ROWS as _, index (index)}
        <div class="guide-row is-loading">
          <span class="severity-rail"></span>
          <span class="guide-copy">
            <span class="guide-label"></span>
            <span class="guide-severity"></span>
          </span>
        </div>
      {/each}
    </div>
  {:else if guideNotice}
    <div class="guide-list">
      <div class="guide-row" data-severity={guideNotice.severityTone}>
        <span class="severity-rail" aria-hidden="true"></span>
        <span class="guide-copy">
          <span class="guide-label bold secondary">{guideNotice.label}</span>
        </span>
      </div>
    </div>
  {/if}
</section>

<style>
  .trakt-media-parental-guide {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding-top: var(--gap-l);

    border-top: var(--ni-1) solid var(--color-border);
  }

  .trakt-media-parental-guide .guide-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: 0;
    margin: 0;

    list-style: none;
  }

  .trakt-media-parental-guide .guide-row {
    display: grid;
    grid-template-columns: var(--ni-6) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-s);
    min-height: var(--ni-32);
  }

  .trakt-media-parental-guide .severity-rail {
    width: var(--ni-6);
    height: var(--ni-28);

    border-radius: var(--border-radius-xs);
    background: var(--guide-severity-color, var(--shade-500));
  }

  .trakt-media-parental-guide .guide-copy {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .trakt-media-parental-guide .guide-label,
  .trakt-media-parental-guide .guide-severity {
    overflow-wrap: anywhere;
  }

  .trakt-media-parental-guide .guide-row[data-severity="none"] {
    --guide-severity-color: var(--shade-300);
  }

  .trakt-media-parental-guide .guide-row[data-severity="mild"] {
    --guide-severity-color: var(--green-500);
  }

  .trakt-media-parental-guide .guide-row[data-severity="moderate"] {
    --guide-severity-color: var(--yellow-500);
  }

  .trakt-media-parental-guide .guide-row[data-severity="severe"] {
    --guide-severity-color: var(--red-500);
  }

  .trakt-media-parental-guide .guide-row.is-loading .severity-rail,
  .trakt-media-parental-guide .guide-row.is-loading .guide-label,
  .trakt-media-parental-guide .guide-row.is-loading .guide-severity {
    background: color-mix(
      in srgb,
      var(--color-text-secondary) 18%,
      transparent
    );
  }

  .trakt-media-parental-guide .guide-row.is-loading .guide-label,
  .trakt-media-parental-guide .guide-row.is-loading .guide-severity {
    display: block;
    height: var(--ni-14);

    border-radius: var(--border-radius-xs);
  }

  .trakt-media-parental-guide .guide-row.is-loading .guide-label {
    width: min(var(--ni-192), 60%);
  }

  .trakt-media-parental-guide .guide-row.is-loading .guide-severity {
    width: var(--ni-72);
  }
</style>
