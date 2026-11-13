<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useParentalGuideCategories } from "$lib/sections/summary/components/useParentalGuideCategories.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { toGuidanceChips } from "./toGuidanceChips.ts";

  const { media }: { media: MovieEntry | ShowEntry } = $props();

  const { categories, isLoading } = useParentalGuideCategories({
    target$: fromRune(() => ({ type: media.type, slug: media.slug })),
  });

  const isPhone = useMedia(WellKnownMediaQuery.mobile);

  const chips = $derived(toGuidanceChips($categories));
  const certification = $derived(media.certification ?? null);
  const isVisible = $derived(Boolean(certification) || chips.isReported);
  const lines = $derived(
    chips.flagged.length > 0
      ? chips.flagged
      : chips.isReported
        ? [
            {
              key: "none",
              label: m.text_parental_guide_nothing_flagged(),
              severityLabel: "",
              severityTone: "none",
            },
          ]
        : [],
  );
</script>

{#if isVisible}
  <div class="trakt-mixtape-stage-guidance" aria-busy={$isLoading}>
    <div class="guidance-header">
      <p class="tag uppercase bold guidance-kicker">
        {m.option_text_certification_parental_guidance()}
      </p>
      {#if certification}
        <span class="guidance-certification">
          <span class="guidance-accessible-label">
            {m.label_certification_rated({ certification })}
          </span>
          <span class="bold" aria-hidden="true">{certification}</span>
        </span>
      {/if}
    </div>

    {#if $isLoading}
      <Skeleton
        height="var(--ni-24)"
        width="60%"
        radius="var(--border-radius-pill)"
      />
    {:else if $isPhone}
      <!-- Phones: the same flags as one wrapping line, no chip can run off the screen. -->
      <p class="tag guidance-line">
        {#each lines as line (line.key)}
          <span class="guidance-item" data-severity={line.severityTone}>
            <span class="bold">{line.label}</span>
            {#if line.severityLabel}
              <span class="guidance-severity">{line.severityLabel}</span>
            {/if}
          </span>
        {/each}
      </p>
    {:else if lines.length > 0}
      <ul class="guidance-chips">
        {#each lines as line (line.key)}
          <li class="guidance-chip" data-severity={line.severityTone}>
            <span class="bold">{line.label}</span>
            {#if line.severityLabel}
              <span class="guidance-severity">{line.severityLabel}</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /*
    Spacing hooks: the details column keeps the defaults, the phone sheet
    pulls the block up to the Today body's rhythm and pads it like the body.
  */
  .trakt-mixtape-stage-guidance {
    --guidance-tone: var(--color-text-secondary);

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    box-sizing: border-box;
    min-width: 0;
    margin-block-start: var(--margin-mixtape-guidance, 0);
    padding-block-start: var(--gap-mixtape-guidance, var(--gap-m));
    padding-inline: var(--inset-mixtape-guidance, 0);
    padding-block-end: var(--inset-mixtape-guidance, 0);

    border-block-start: var(--border-thickness-xxs) solid var(--color-border);

    p {
      margin: 0;
    }

    .guidance-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);
    }

    .guidance-kicker {
      color: var(--color-text-emphasis);
    }

    .guidance-certification,
    .guidance-chip {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      gap: var(--gap-xxs);

      box-sizing: border-box;
      height: var(--ni-24);
      padding-inline: var(--ni-10);

      border-radius: var(--border-radius-pill);
      background: color-mix(in srgb, var(--guidance-tone) 16%, transparent);
      white-space: nowrap;

      span {
        color: var(--color-text-primary);
        font-size: var(--font-size-tag);
      }
    }

    .guidance-certification {
      --guidance-tone: var(--color-text-primary);
    }

    .guidance-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xxs);

      margin: 0;
      padding: 0;
      list-style: none;
    }

    .guidance-chip,
    .guidance-item {
      &::before {
        content: "";
        flex: none;
        width: var(--ni-6);
        height: var(--ni-6);
        border-radius: var(--border-radius-pill);
        background: var(--guidance-tone);
      }

      .guidance-severity {
        color: var(--color-text-secondary);
      }

      &[data-severity="none"] {
        --guidance-tone: var(--shade-300);
      }

      &[data-severity="mild"] {
        --guidance-tone: var(--green-500);
      }

      &[data-severity="moderate"] {
        --guidance-tone: var(--yellow-500);
      }

      &[data-severity="severe"] {
        --guidance-tone: var(--red-500);
      }
    }

    .guidance-line {
      color: var(--color-text-primary);
      line-height: 1.6;
    }

    .guidance-item {
      margin-inline-end: var(--ni-12);
      white-space: nowrap;

      &::before {
        display: inline-block;
        margin-inline-end: var(--ni-4);
        vertical-align: middle;
      }
    }

    .guidance-accessible-label {
      @include visually-hidden;
    }
  }
</style>
