<script lang="ts">
  import StreamingServiceButton from "$lib/components/buttons/streaming-service/StreamingServiceButton.svelte";
  import AirDate from "$lib/components/media/tags/AirDateTag.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import PlaysTag from "$lib/components/media/tags/PlaysTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchCountTag from "$lib/components/media/tags/WatchCountTag.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
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
      <WatchCountTag
        i18n={TagIntlProvider}
        count={watchCount}
        type={media.type}
      />

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
    {#if streamOn?.preferred}
      <RenderFor
        device={["tablet-lg", "desktop"]}
        audience="all"
        navigation="default"
      >
        <StreamingServiceButton
          mediaTitle={media.title}
          service={streamOn.preferred}
          style="normal"
        />
      </RenderFor>
      <RenderFor
        device={["tablet-sm", "mobile"]}
        audience="all"
        navigation="default"
      >
        <StreamingServiceButton
          mediaTitle={media.title}
          service={streamOn.preferred}
          style="logo"
        />
      </RenderFor>
    {/if}
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
