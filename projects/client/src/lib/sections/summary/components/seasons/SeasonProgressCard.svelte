<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider.ts";
  import EpisodeDurationTag from "$lib/components/episode/tags/EpisodeDurationTag.svelte";
  import EpisodeRemainingTag from "$lib/components/episode/tags/EpisodeRemainingTag.svelte";
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import { stretchedPercentage } from "$lib/utils/number/stretchedPercentage.ts";

  type SeasonProgressCardProps = {
    seasonNumber: number;
    watched: number;
    total: number;
    totalRuntime: number;
    loading?: boolean;
  };

  const {
    seasonNumber,
    watched,
    total,
    totalRuntime,
    loading = false,
  }: SeasonProgressCardProps = $props();

  const barPercentage = $derived.by(() => {
    if (total === 0) return 0;
    if (watched >= total) return 100;
    return stretchedPercentage({ value: watched, total });
  });

  const progressPercentage = $derived(
    total === 0 ? 0 : Math.min(1.0, watched / total),
  );

  const remaining = $derived(Math.max(0, total - watched));
  const isComplete = $derived(total > 0 && watched >= total);
  const isStarted = $derived(watched > 0);
  const minutesLeft = $derived(
    !isNaN(totalRuntime) && remaining > 0 && total > 0
      ? Math.round((totalRuntime / total) * remaining)
      : 0,
  );
</script>

{#snippet tags()}
  {#if !isComplete && remaining > 0}
    <EpisodeRemainingTag i18n={EpisodeIntlProvider} {remaining} />
    {#if !isNaN(totalRuntime) && minutesLeft > 0}
      <EpisodeDurationTag i18n={EpisodeIntlProvider} {minutesLeft} />
    {/if}
  {/if}
{/snippet}

<div class="season-progress-card" class:is-complete={isComplete}>
  <div class="progress-header">
    <p class="bold capitalize">
      {seasonNumber === 0
        ? m.section_title_specials_progress()
        : m.section_title_season_progress({ number: seasonNumber })}
    </p>
    <div class="progress-header-right">
      {#if loading}
        <div class="skeleton skeleton-badge"></div>
      {:else if isComplete}
        <p class="tag secondary capitalize complete-label">
          {m.text_season_complete()}
        </p>
      {:else if isStarted}
        <p class="tag secondary">
          {toPercentage(progressPercentage, languageTag())}
        </p>
      {:else}
        <p class="tag secondary capitalize">
          {m.text_season_not_started()}
        </p>
      {/if}
    </div>
  </div>

  {#if loading}
    <div class="progress-skeleton skeleton"></div>
  {:else}
    <ProgressTag progress={barPercentage} {tags}>
      {m.tag_text_number_of_episodes({ count: watched })}
    </ProgressTag>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .season-progress-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-16);

    background: var(--color-card-background);
    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-base);
  }

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .progress-header-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .complete-label {
      color: var(--color-text-emphasis);
    }
  }

  .progress-skeleton {
    height: var(--ni-20);
    border-radius: var(--border-radius-m);
  }

  .skeleton {
    position: relative;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    background: color-mix(in srgb, var(--color-text-primary) 8%, transparent);
  }

  .skeleton::after {
    content: "";

    position: absolute;
    top: 0;
    left: 0;

    width: 300%;
    height: 100%;

    transform: translateX(100%);

    animation: slide calc(10 * var(--transition-increment)) infinite;

    background: linear-gradient(
      110deg,
      transparent 0%,
      transparent 30%,
      color-mix(in srgb, var(--color-foreground) 50%, transparent) 50%,
      transparent 70%,
      transparent 100%
    );

    opacity: 0.2;
  }

  .skeleton-badge {
    width: var(--ni-56);
    height: var(--ni-16);
  }
</style>
