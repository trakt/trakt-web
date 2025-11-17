<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useNowPlaying } from "$lib/features/toast/useNowPlaying";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { getToastTitle } from "./getToastTitle";
  import ProgressBar from "./ProgressBar.svelte";
  import StopButton from "./StopButton.svelte";
  import ToastItemCard from "./ToastItemCard.svelte";

  const { nowPlaying }: { nowPlaying: NowPlayingItem } = $props();

  const { remainingMinutes, progress } = useNowPlaying();
  const title = $derived(getToastTitle(nowPlaying));
</script>

<div class="trakt-now-playing-container">
  <ToastItemCard item={nowPlaying} />
  <div class="trakt-now-playing-content">
    <div class="trakt-now-playing-header">
      {#if nowPlaying.media.postCredits.length > 0}
        <div class="trakt-post-credits-label">
          <span class="meta-info post-credits-count">
            {nowPlaying.media.postCredits.length}
          </span>
          <span class="meta-info">{m.header_post_credits()}</span>
        </div>
      {:else}
        <div class="trakt-now-playing-label">
          {m.header_now_playing()}
        </div>
      {/if}
      <StopButton {nowPlaying} {title} />
    </div>
    <div class="trakt-now-playing-status">
      <h5 class="trakt-now-playing-title ellipsis">
        {title}
      </h5>
      <div class="trakt-now-playing-remaining">
        <span class="meta-info">
          {toHumanDuration({ minutes: $remainingMinutes }, languageTag())}
        </span>
        <span class="meta-info">{m.text_remaining()}</span>
      </div>
    </div>
    <ProgressBar progress={$progress} />
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    flex-grow: 1;
    min-width: 0;
    gap: var(--gap-xxs);
  }

  .trakt-now-playing-label,
  .trakt-now-playing-title {
    transition: font-size var(--transition-increment) ease-in-out;
  }

  .trakt-now-playing-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .trakt-now-playing-label {
    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }

  .trakt-now-playing-title {
    @include for-mobile {
      font-size: var(--font-size-title);
    }
  }

  .trakt-now-playing-remaining {
    display: flex;
    align-items: center;

    gap: var(--gap-xxs);

    @include for-mobile {
      flex-direction: column;
      align-items: flex-end;

      gap: 0;
    }
  }

  .trakt-now-playing-status {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    @include for-mobile {
      align-items: center;
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
