<script lang="ts">
  import AirDate from "$lib/components/media/tags/AirDateTag.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import PlaysTag from "$lib/components/media/tags/PlaysTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchCountTag from "$lib/components/media/tags/WatchCountTag.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import StreamOnButton from "../stream/StreamOnButton.svelte";
  import { useMediaMetaInfo, type MetaInfoProps } from "./useMediaMetaInfo";

  type MediaMetaInfoProps = {
    watchCount: number;
    streamOn?: StreamOn;
  } & MetaInfoProps;

  const { streamOn, watchCount, ...target }: MediaMetaInfoProps = $props();

  const media = $derived(
    target.type === "episode" ? target.episode : target.media,
  );
  const isAiredItem = $derived(media.airDate < new Date());

  const { ratings, plays } = $derived(useMediaMetaInfo(target));
</script>

<div class="trakt-summary-meta">
  <div class="trakt-summary-meta-container">
    <RatingList ratings={$ratings} airDate={media.airDate} />
    <div class="trakt-meta-tags">
      {#if watchCount > 1}
        <WatchCountTag i18n={TagIntlProvider} count={watchCount} />
      {/if}

      {#if media.certification}
        <InfoTag>
          {media.certification}
        </InfoTag>
      {/if}

      {#if media.year}
        <AirDate
          i18n={TagIntlProvider}
          year={media.year}
          airDate={media.airDate}
        />
      {/if}

      <!-- FIXME: re-enable watchers once we have better watching stats -->
      {#if isAiredItem}
        <PlaysTag i18n={TagIntlProvider} plays={$plays} />
      {/if}
    </div>
  </div>
  <div class="trakt-summary-watch-container">
    <RenderFor
      device={["tablet-lg", "desktop"]}
      audience="all"
      navigation="default"
    >
      <StreamOnButton {streamOn} {...target} style="normal" />
    </RenderFor>
    <RenderFor
      device={["tablet-sm", "mobile"]}
      audience="all"
      navigation="default"
    >
      <StreamOnButton {streamOn} {...target} style="logo" />
    </RenderFor>
  </div>
</div>

<style>
  .trakt-summary-meta {
    display: flex;
    flex-wrap: wrap;

    justify-content: space-between;
    align-items: center;

    gap: var(--gap-m);
  }

  .trakt-summary-meta-container {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xs);
  }

  .trakt-summary-watch-container,
  .trakt-meta-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    gap: var(--gap-xs);
  }
</style>
