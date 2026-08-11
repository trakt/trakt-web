<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";

  /*
    The standing itself - bar, behind-count, totals and time left - shared by
    the header's recap column and the recap drawer so the two can never
    disagree about where the viewer stands.
  */
  const { progress }: { progress: EpisodeProgressEntry } = $props();

  const percentage = $derived(
    progress.total > 0 ? (progress.completed / progress.total) * 100 : 0,
  );

  const timeLeft = $derived(
    progress.minutesLeft > 0
      ? toHumanDuration({ minutes: progress.minutesLeft, clampAt: "day" })
      : null,
  );
</script>

<div class="trakt-recap-progress">
  <div
    class="recap-bar"
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={progress.total}
    aria-valuenow={progress.completed}
  >
    <div class="recap-bar-fill" style:width="{percentage}%"></div>
  </div>

  <div class="recap-standing">
    {#if progress.remaining > 0}
      <span class="recap-behind">
        {m.text_recap_behind({ count: progress.remaining })}
      </span>
    {:else}
      <span class="recap-caught-up">{m.text_recap_caught_up()}</span>
    {/if}

    <span class="recap-totals">
      {m.text_recap_of_total({
        completed: progress.completed,
        total: progress.total,
      })}{#if timeLeft}
        · {m.text_recap_time_left({ duration: timeLeft })}{/if}
    </span>
  </div>
</div>

<style lang="scss">
  .trakt-recap-progress {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    width: 100%;
    min-width: 0;
  }

  .recap-bar {
    width: 100%;
    height: var(--ni-4);
    border-radius: var(--ni-2);

    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    overflow: hidden;
  }

  .recap-bar-fill {
    height: 100%;
    border-radius: inherit;

    background: var(--purple-500);
  }

  .recap-standing {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--gap-s);

    font-size: var(--font-size-text);
  }

  .recap-behind {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--orange-400);
  }

  .recap-caught-up {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--green-400);
  }

  .recap-totals {
    color: var(--color-text-secondary);
  }
</style>
