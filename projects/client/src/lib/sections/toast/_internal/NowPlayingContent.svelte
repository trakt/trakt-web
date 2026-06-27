<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useNowPlaying } from "$lib/features/toast/useNowPlaying";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { getToastTitle } from "./getToastTitle";
  import ProgressBar from "./ProgressBar.svelte";
  import StopButton from "./StopButton.svelte";
  import ToastItemCard from "./ToastItemCard.svelte";

  const { nowPlaying }: { nowPlaying: NowPlayingItem } = $props();

  const { remainingMinutes, progress } = useNowPlaying();

  const title = $derived(getToastTitle(nowPlaying));
  const endsAt = $derived(
    toHumanClockTime(nowPlaying.expiresAt, languageTag()),
  );
  const remainingDuration = $derived(
    toHumanDuration({ minutes: $remainingMinutes }, languageTag()),
  );
</script>

<div class="trakt-now-playing-container">
  <ToastItemCard item={nowPlaying} />
  <div class="trakt-now-playing-content">
    <div class="trakt-now-playing-header">
      {#if nowPlaying.media.postCredits.length > 0}
        <div class="trakt-post-credits-label">
          <span class="small bold post-credits-count">
            {nowPlaying.media.postCredits.length}
          </span>
          <span class="small bold">{m.header_post_credits()}</span>
        </div>
      {:else}
        <span class="secondary small">
          {m.header_now_playing()}
        </span>
      {/if}
      <StopButton {nowPlaying} {title} />
    </div>

    <span class="bold ellipsis">
      {title}
    </span>

    <div class="trakt-now-playing-progress">
      <div class="trakt-now-playing-info">
        <span class="trakt-now-playing-remaining ellipsis small">
          {m.tag_text_remaining_duration({ duration: remainingDuration })}
        </span>
        <span class="trakt-now-playing-ends-at ellipsis small">
          {m.text_ends_at({ time: endsAt })}
        </span>
      </div>

      <ProgressBar progress={$progress} />
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-now-playing-container {
    display: flex;
    gap: var(--gap-m);

    width: 100%;
  }

  .trakt-now-playing-content {
    /*
      Some extra vertical padding due to an optical illusion,
      which is caused by the poster having rounder corners
    */
    --content-vertical-padding: var(--ni-4);

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    flex-grow: 1;
    min-width: 0;
    gap: var(--gap-xxs);

    padding: var(--content-vertical-padding) 0px;

    @include for-tablet-sm-and-below {
      --content-vertical-padding: var(--ni-2);
    }
  }

  .trakt-now-playing-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    position: relative;

    :global(.trakt-action-button) {
      --stop-button-offset: var(--ni-neg-6);
      position: absolute;
      top: calc(var(--stop-button-offset) - var(--content-vertical-padding));
      inset-inline-end: var(--stop-button-offset);
    }
  }

  .trakt-now-playing-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-xxs);
  }

  .trakt-now-playing-progress {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-now-playing-remaining,
  .trakt-now-playing-ends-at {
    min-width: 0;

    @include for-tablet-sm-and-below {
      font-size: var(--font-size-tag);
    }
  }

  .trakt-post-credits-label,
  .post-credits-count {
    display: flex;
    align-items: center;
    justify-content: center;

    gap: var(--gap-xxs);
  }

  .post-credits-count {
    width: var(--ni-20);
    height: var(--ni-20);

    border-radius: 50%;
    background-color: rgba(254, 254, 254, 0.35);
  }
</style>
