<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useParentalGuideCategories } from "../../_internal/useParentalGuideCategories.ts";

  const { type, slug }: { type: MediaType; slug: string } = $props();

  const { categories, isError, isLoading } = useParentalGuideCategories({
    target$: fromRune(() => ({ type, slug })),
  });

  const guideState = $derived.by(() => {
    if ($isLoading) {
      return "loading";
    }

    if ($isError) {
      return "error";
    }

    return "ready";
  });

  const isPending = $derived(guideState === "loading");
</script>

<section
  class="trakt-media-parental-guide"
  aria-busy={isPending}
  data-state={guideState}
>
  <p class="guide-heading bold secondary">
    {m.option_text_certification_parental_guidance()}
  </p>

  {#if guideState !== "error"}
    <ul class="guide-list">
      {#each $categories as category (category.key)}
        {@const severityLabel = isPending
          ? m.yir_state_loading()
          : category.severityLabel}
        <li
          class="guide-row"
          data-severity={isPending ? "unknown" : category.severityTone}
        >
          <span class="guide-label bold">
            {category.label}
          </span>
          <div class="guide-meter">
            <span class="guide-accessible-label">
              {category.label}: {severityLabel}
            </span>
            <div class="guide-bar" aria-hidden="true">
              <DistributionBar
                fraction={isPending ? 0 : category.severityProgress}
                color="var(--guide-severity-color)"
                fillStyle="flat"
                animated={false}
                --distribution-bar-thickness="var(--ni-8)"
                --distribution-bar-track="var(--guide-track-color)"
              />
            </div>
          </div>
          <span class="guide-severity secondary">
            {severityLabel}
          </span>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="guide-list">
      <div class="guide-row" data-severity="severe">
        <span class="guide-notice bold secondary">
          {m.error_text_parental_guide_load_failed()}
        </span>
      </div>
    </div>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-media-parental-guide {
    --guide-track-color: color-mix(
      in srgb,
      var(--color-text-secondary) 22%,
      transparent
    );

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding-top: var(--gap-l);

    border-top: var(--ni-1) solid var(--color-border);
  }

  .trakt-media-parental-guide .guide-heading {
    max-width: 100%;
  }

  .trakt-media-parental-guide .guide-list {
    display: flex;
    flex-direction: column;
    gap: 0;

    padding: 0;
    margin: 0;

    list-style: none;
  }

  .trakt-media-parental-guide .guide-row {
    display: grid;
    grid-template-columns:
      minmax(0, 1fr)
      minmax(var(--ni-80), 0.72fr)
      var(--ni-96);
    align-items: center;
    gap: var(--gap-l);
    height: var(--ni-52);

    border-bottom: var(--ni-1) solid var(--color-border);
  }

  .trakt-media-parental-guide .guide-row:last-child {
    border-bottom: none;
  }

  .trakt-media-parental-guide .guide-label,
  .trakt-media-parental-guide .guide-meter,
  .trakt-media-parental-guide .guide-severity {
    min-width: 0;
  }

  .trakt-media-parental-guide .guide-label,
  .trakt-media-parental-guide .guide-severity {
    display: -webkit-box;
    overflow: hidden;

    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .trakt-media-parental-guide .guide-meter {
    display: block;
    width: 100%;
  }

  .trakt-media-parental-guide .guide-severity {
    color: var(--guide-severity-color);

    text-align: end;
  }

  .trakt-media-parental-guide .guide-bar {
    width: 100%;
  }

  .trakt-media-parental-guide .guide-accessible-label {
    @include visually-hidden;
  }

  .trakt-media-parental-guide .guide-notice {
    grid-column: 1 / -1;
  }

  .trakt-media-parental-guide .guide-row[data-severity="none"] {
    --guide-severity-color: var(--shade-300);
  }

  .trakt-media-parental-guide .guide-row[data-severity="unknown"] {
    --guide-severity-color: var(--color-text-secondary);
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

  @include for-mobile {
    .trakt-media-parental-guide .guide-row {
      grid-template-columns: minmax(0, 1fr) var(--ni-96);
      gap: var(--gap-xs) var(--gap-m);
      height: var(--ni-64);
      box-sizing: border-box;
      padding-block: var(--gap-xs);
    }

    .trakt-media-parental-guide .guide-meter {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }
</style>
