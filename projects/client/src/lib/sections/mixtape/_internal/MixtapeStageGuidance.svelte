<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useParentalGuideCategories } from "$lib/sections/summary/components/useParentalGuideCategories.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { toGuidanceChips } from "./toGuidanceChips.ts";

  const { media }: { media: MovieEntry | ShowEntry } = $props();

  const { categories, isLoading } = useParentalGuideCategories({
    target$: fromRune(() => ({ type: media.type, slug: media.slug })),
  });

  const chips = $derived(toGuidanceChips($categories));
  const certification = $derived(media.certification ?? null);
  const isVisible = $derived(Boolean(certification) || chips.isReported);
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
    {:else if chips.flagged.length > 0}
      <ul class="guidance-chips">
        {#each chips.flagged as chip (chip.key)}
          <li class="guidance-chip" data-severity={chip.severityTone}>
            <span class="bold">{chip.label}</span>
            <span class="guidance-severity">{chip.severityLabel}</span>
          </li>
        {/each}
      </ul>
    {:else if chips.isReported}
      <ul class="guidance-chips">
        <li class="guidance-chip" data-severity="none">
          <span class="bold">{m.text_parental_guide_nothing_flagged()}</span>
        </li>
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

    .guidance-chip {
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

    .guidance-accessible-label {
      @include visually-hidden;
    }

    /* Phones: one row of chips that scrolls sideways, bleeding to the screen edge. */
    @include for-mobile {
      .guidance-chips {
        flex-wrap: nowrap;
        margin-inline: calc(-1 * var(--layout-distance-side));
        padding-inline: var(--layout-distance-side);
        overflow-x: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
</style>
