<script lang="ts">
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import "$lib/features/edit-mode/edit-mode.css";
  import EditModeVisibilityButton from "$lib/features/edit-mode/EditModeVisibilityButton.svelte";
  import { useEditMode } from "$lib/features/edit-mode/useEditMode";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import BannerContainer from "$lib/sections/banner/_internal/BannerContainer.svelte";
  import {
    dashboardDrawerNavigation,
    DashboardDrawers,
  } from "../dashboard/_internal/dashboardDrawerNavigation";
  import StreakIcon from "./_internal/icons/StreakIcon.svelte";
  import StreakAccumulator from "./_internal/StreakAccumulator.svelte";
  import { useActivityHeatmap } from "./_internal/useActivityHeatmap.ts";
  import { useStreak } from "./_internal/useStreak";

  const { mode } = useDiscover();

  const id = "daily-streak";
  const { isEditMode, section } = useEditMode();
  const {
    isHidden,
    toggle: toggleHidden,
    action: editModeAction,
  } = $derived(section(id));

  const { streakCount, isLoading } = $derived(useStreak({ mode: $mode }));
  const { heatmap } = $derived(
    useActivityHeatmap({ mode: $mode, period: "week" }),
  );
  const { buildDrawerLink } = dashboardDrawerNavigation();
  const drilldownLink = $derived(buildDrawerLink(DashboardDrawers.Streak));

  const streakLabel = $derived(
    $streakCount === 1
      ? m.text_stats_day_count({ count: String($streakCount) })
      : m.text_stats_days_count({ count: String($streakCount) }),
  );

  const { isEnabled } = useFeatureFlag();
  const isEditModeEnabled = $derived(isEnabled(FeatureFlag.EditMode));
</script>

{#snippet editAction()}
  <EditModeVisibilityButton
    isHidden={$isHidden}
    label={$isHidden
      ? m.button_label_show_section({
          section: m.drawer_title_streak_activity(),
        })
      : m.button_label_hide_section({
          section: m.drawer_title_streak_activity(),
        })}
    onclick={toggleHidden}
  />
{/snippet}

{#if !$isEditModeEnabled || $isEditMode || !$isHidden}
  {#if $isLoading}
    <BannerContainer variant="fluid">
      <div class="trakt-streak-skeleton"></div>
    </BannerContainer>
  {:else}
    <BannerContainer
      variant="fluid"
      action={$isEditMode ? editAction : undefined}
    >
      <trakt-streak-callout>
        <Link {...drilldownLink} disabled={$isEditMode}>
          <div class="trakt-streak-callout" use:editModeAction>
            <div class="trakt-streak-left">
              <div class="trakt-streak-flame">
                <StreakIcon count={$streakCount} />
              </div>

              <div class="trakt-streak-info">
                <p class="trakt-streak-title bold">
                  <span class="trakt-streak-count bold">{streakLabel}</span>
                  {m.text_stats_watching_streak()}
                </p>
              </div>
            </div>

            <div class="trakt-streak-right">
              <div class="trakt-streak-accumulator">
                <StreakAccumulator cells={$heatmap?.cells ?? []} />
              </div>
              <div class="trakt-streak-footer">
                <ArrowRightIcon />
              </div>
            </div>
          </div>
        </Link>
      </trakt-streak-callout>
    </BannerContainer>
  {/if}
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-streak-callout,
  .trakt-streak-skeleton {
    height: var(--ni-74);
  }

  trakt-streak-callout {
    display: contents;

    :global(.trakt-link) {
      text-decoration: none;

      :global(.secondary) {
        color: var(--color-text-secondary);
      }
    }
  }

  // TODO: extract shared skeleton shimmer mixin (see also SkeletonCard.svelte)
  .trakt-streak-skeleton {
    border-radius: var(--border-radius-l);
    background: var(--color-streak-surface);
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      width: 300%;
      height: 100%;
      transform: translateX(100%);
      animation: slide calc(20 * var(--transition-increment)) infinite;
      background: linear-gradient(
        110deg,
        var(--color-streak-surface) 0%,
        var(--color-streak-surface) 30%,
        color-mix(in srgb, var(--color-foreground) 50%, transparent) 50%,
        var(--color-streak-surface) 70%,
        var(--color-streak-surface) 100%
      );
      opacity: 0.2;
    }
  }

  .trakt-streak-callout {
    background: var(--color-streak-surface);

    padding: var(--ni-12);
    padding-right: var(--ni-18);

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    border: var(--ni-1) solid var(--color-streak-border);
    border-radius: var(--border-radius-l);
  }

  .trakt-streak-left {
    display: flex;
    align-items: center;
    gap: var(--gap-l);
    min-width: 0;
    flex: 1;

    @include for-tablet-sm-and-below {
      gap: var(--gap-s);
    }
  }

  .trakt-streak-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-l);

    max-width: var(--ni-160);
    flex: 1;

    @include for-tablet-sm-and-below {
      gap: var(--gap-s);
      flex: none;
    }
  }

  .trakt-streak-flame {
    width: var(--ni-48);
    height: var(--ni-48);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .trakt-streak-info {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    min-width: 0;
  }

  .trakt-streak-title,
  .trakt-streak-count {
    font-size: var(--ni-18);
  }

  .trakt-streak-accumulator {
    display: flex;
    flex: 1;

    @include for-tablet-sm-and-below {
      align-items: center;
    }
  }

  .trakt-streak-footer {
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
