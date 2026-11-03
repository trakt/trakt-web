<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import SummaryHeaderLabel from "../../../header-kit/SummaryHeaderLabel.svelte";
  import { toProgressOutlook } from "./toProgressOutlook.ts";

  /*
    The Progress column's body: what to watch next, with a mark-watched beside
    it, then how far through the show the viewer is. The synopsis of an
    episode already seen was the least useful thing here, so the last episode
    seen is down to one line under the bar.

    Two 44px rows, the same rhythm as the friend and provider rows in the
    columns beside it.
  */
  const {
    progress,
    show,
  }: {
    progress: EpisodeProgressEntry;
    show: { id: number; title: string };
  } = $props();

  const outlook = $derived(toProgressOutlook(progress));
</script>

<div class="trakt-summary-header-up-next">
  {#if outlook.next}
    <div class="up-next-row">
      <div class="up-next-text">
        <SummaryHeaderLabel text={outlook.next.kicker} />
        <span class="up-next-episode">{outlook.next.label}</span>
      </div>

      <span class="up-next-mark">
        <MarkAsWatchedAction
          style="action"
          type="episode"
          title={outlook.next.label}
          {show}
          media={progress}
        />
      </span>
    </div>
  {/if}

  <div class="up-next-progress">
    <DistributionBar
      fraction={outlook.fraction}
      fillStyle="flat"
      color="var(--color-text-primary)"
      label={outlook.foot}
    />
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

  /* The design's outlined circle; the button inside keeps its own hover. */
  .up-next-mark {
    display: inline-flex;
    flex: none;

    border-radius: var(--border-radius-pill);
    box-shadow: inset 0 0 0 var(--ni-1)
      color-mix(in srgb, var(--color-text-primary) 22%, transparent);
  }

  .up-next-progress {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--ni-8);

    --distribution-bar-thickness: var(--ni-4);
    --distribution-bar-track: color-mix(
      in srgb,
      var(--color-text-primary) 8%,
      transparent
    );
  }

  .up-next-foot {
    font-size: var(--font-size-text-small);
    line-height: var(--ni-16);
    color: var(--color-text-quiet);
  }
</style>
