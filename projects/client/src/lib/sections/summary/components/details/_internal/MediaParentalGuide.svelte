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
        label: m.error_text_parental_guide_load_failed(),
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
  <p class="guide-title">
    {m.option_text_certification_parental_guidance()}
  </p>

  {#if guideState === "ready"}
    <ul class="guide-list">
      {#each $categories as category (category.key)}
        <li class="guide-row" data-severity={category.severityTone}>
          <span class="guide-label bold">{category.label}</span>
          <span class="severity-meter" aria-hidden="true">
            <span class="severity-meter-fill"></span>
          </span>
          <span class="guide-severity">{category.severityLabel}</span>
        </li>
      {/each}
    </ul>
  {:else if guideState === "loading"}
    <div class="guide-list" aria-hidden="true">
      {#each LOADING_ROWS as _, index (index)}
        <div class="guide-row is-loading">
          <span class="guide-label"></span>
          <span class="severity-meter"></span>
          <span class="guide-severity"></span>
        </div>
      {/each}
    </div>
  {:else if guideNotice}
    <div class="guide-list">
      <div class="guide-row guide-row-notice" data-severity={guideNotice.severityTone}>
        <span class="guide-label bold secondary">{guideNotice.label}</span>
      </div>
    </div>
  {/if}
</section>

<style>
  .trakt-media-parental-guide {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .guide-title {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .trakt-media-parental-guide .guide-list {
    display: flex;
    flex-direction: column;

    padding: 0;
    margin: 0;

    list-style: none;
  }

  /* Label at the start, the meter and its word ranged at the end. */
  .trakt-media-parental-guide .guide-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ni-96) var(--ni-80);
    align-items: center;
    gap: var(--gap-s);
    min-height: var(--ni-40);

    + .guide-row {
      border-top: var(--ni-1) solid var(--color-hairline);
    }
  }

  .trakt-media-parental-guide .guide-row-notice {
    grid-template-columns: minmax(0, 1fr);
  }

  .trakt-media-parental-guide .guide-label {
    overflow-wrap: anywhere;
  }

  .trakt-media-parental-guide .severity-meter {
    height: var(--ni-6);
    border-radius: 999px;
    overflow: hidden;

    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
  }

  .trakt-media-parental-guide .severity-meter-fill {
    display: block;
    height: 100%;
    width: var(--guide-severity-share, 0%);
    border-radius: inherit;

    background: var(--guide-severity-color, var(--shade-500));
  }

  /* The severity speaks in its own colour, ranged at the end. */
  .trakt-media-parental-guide .guide-severity {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    text-align: end;

    color: var(--guide-severity-color, var(--color-text-secondary));
  }

  .trakt-media-parental-guide .guide-row[data-severity="none"] {
    --guide-severity-color: var(--shade-300);
    --guide-severity-share: 8%;
  }

  .trakt-media-parental-guide .guide-row[data-severity="mild"] {
    --guide-severity-color: var(--green-500);
    --guide-severity-share: 30%;
  }

  .trakt-media-parental-guide .guide-row[data-severity="moderate"] {
    --guide-severity-color: var(--yellow-500);
    --guide-severity-share: 60%;
  }

  .trakt-media-parental-guide .guide-row[data-severity="severe"] {
    --guide-severity-color: var(--red-500);
    --guide-severity-share: 90%;
  }

  .trakt-media-parental-guide .guide-row.is-loading .guide-label,
  .trakt-media-parental-guide .guide-row.is-loading .guide-severity {
    height: var(--ni-12);
    border-radius: var(--border-radius-xs);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }
</style>
