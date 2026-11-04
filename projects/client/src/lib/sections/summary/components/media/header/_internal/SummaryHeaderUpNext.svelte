<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import { getEpisodeStatus } from "$lib/components/episode/getEpisodeStatus";
  import EpisodeDurationTag from "$lib/components/episode/tags/EpisodeDurationTag.svelte";
  import EpisodeRemainingTag from "$lib/components/episode/tags/EpisodeRemainingTag.svelte";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import SummaryHeaderLabel from "../../../header-kit/SummaryHeaderLabel.svelte";
  import { toProgressOutlook } from "./toProgressOutlook.ts";

  /*
    The Progress column's body: what to watch next, with a mark-watched beside
    it, then how far through the show the viewer is. The synopsis of an
    episode already seen was the least useful thing here, so the last episode
    seen is down to one line under the bar.

    The bar and the check are Continue Watching's own - the progress tag with
    the next episode's runtime and its status, and the small mark-watched -
    so the same fact looks the same wherever it appears.
  */
  const {
    progress,
    show,
  }: {
    progress: EpisodeProgressEntry;
    show: { id: number; title: string };
  } = $props();

  const outlook = $derived(toProgressOutlook(progress));

  const status = $derived(
    getEpisodeStatus(progress.type, {
      isLatestAired: progress.isLatestAired,
      releaseDate: progress.effectiveReleaseDate,
      episodes: progress.episodes,
    }),
  );
</script>

{#snippet statusTag()}
  <EpisodeStatusTag
    i18n={EpisodeIntlProvider}
    episodeType={progress.type}
    episodes={progress.episodes}
    isLatestAired={progress.isLatestAired}
    releaseDate={progress.effectiveReleaseDate}
  />
{/snippet}

{#snippet progressTags()}
  <EpisodeRemainingTag
    i18n={EpisodeIntlProvider}
    remaining={progress.remaining}
  />
  <EpisodeDurationTag
    i18n={EpisodeIntlProvider}
    minutesLeft={progress.minutesLeft}
  />
{/snippet}

<div class="trakt-summary-header-up-next">
  {#if outlook.next}
    <div class="up-next-row">
      <div class="up-next-text">
        <SummaryHeaderLabel text={outlook.next.kicker} />
        <span class="up-next-episode">{outlook.next.label}</span>
      </div>

      <MarkAsWatchedAction
        mode="hybrid"
        style="action"
        type="episode"
        size="small"
        title={outlook.next.label}
        {show}
        media={progress}
      />
    </div>
  {/if}

  <div class="up-next-progress">
    {#if outlook.next}
      <ShowProgressTag
        i18n={TagIntlProvider}
        progress={progress.completed}
        total={progress.total}
        runtime={progress.runtime}
        tags={status ? statusTag : progressTags}
        style="cover"
      />
    {/if}
    <span class="up-next-foot">{outlook.foot}</span>
  </div>
</div>

<style lang="scss">
  .trakt-summary-header-up-next {
    display: flex;
    flex-direction: column;
    gap: var(--summary-header-row-gap, var(--ni-12));

    width: 100%;
  }

  .up-next-row,
  .up-next-progress {
    min-height: var(--summary-header-row-height, var(--ni-44));
    box-sizing: border-box;
  }

  .up-next-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .up-next-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    flex: 1;
    min-width: 0;
  }

  /* Sized on the span: the global sheet sets every bare span to 14px. */
  .up-next-episode {
    font-size: var(--ni-16);
    font-weight: 700;
    line-height: var(--ni-20);
    color: var(--color-text-primary);
  }

  .up-next-progress {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--ni-8);
  }

  .up-next-foot {
    font-size: var(--font-size-text-small);
    line-height: var(--ni-16);
    color: var(--color-text-quiet);
  }
</style>
