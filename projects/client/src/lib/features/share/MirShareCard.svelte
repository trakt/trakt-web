<svelte:options css="injected" />

<script lang="ts">
  import { toHumanMonthYear } from "$lib/utils/formatting/date/toHumanMonthYear.ts";
  import MirHighlights from "./_internal/MirHighlights.svelte";
  import MirStats from "./_internal/MirStats.svelte";
  import MirTopList from "./_internal/MirTopList.svelte";
  import ShareUserAvatar from "./_internal/ShareUserAvatar.svelte";
  import type { MirShareData } from "./models/MirShareData.ts";
  import type { ShareType } from "./models/ShareType.ts";
  import ShareCardFrame from "./ShareCardFrame.svelte";

  const { data, variant }: { data: MirShareData; variant: ShareType } =
    $props();

  const period = $derived(
    toHumanMonthYear(new Date(Date.UTC(data.year, data.month - 1, 1))),
  );

  const topShow = $derived(data.shows.at(0));
  const topMovie = $derived(data.movies.at(0));
  const topItem = $derived(topShow ?? topMovie);

  type HighlightSource = {
    key: string;
    title: string;
    posterUrl: string;
  };

  const toHighlight = (
    item: HighlightSource | null | undefined,
    { slot, label }: { slot: string; label: string },
  ) =>
    item && {
      ...item,
      key: `${slot}-${item.key}`,
      label,
      isFeatured: slot === "top",
    };

  const highlights = $derived(
    [
      toHighlight(data.firstWatched, { slot: "first", label: "First play" }),
      toHighlight(topItem, { slot: "top", label: "Most watched" }),
      toHighlight(data.lastWatched, { slot: "last", label: "Last play" }),
    ].filter((item) => item != null),
  );
</script>

{#snippet heading()}
  <div class="mir-share-heading">
    <ShareUserAvatar user={data.user} />
    <div class="mir-share-header">
      <div class="mir-share-label">
        <b class="mir-share-label-name">{data.user.name}</b>
        <span>·</span>
        <span>Month in Review</span>
      </div>
      <h1 class="mir-share-period">{period}</h1>
    </div>
  </div>
{/snippet}

<ShareCardFrame {variant} colors={data.colors} backdropWidthRatio={0.9}>
  {#if variant !== "open-graph"}
    <div class="trakt-mir-share-card" data-variant={variant}>
      {@render heading()}
      <MirHighlights {highlights} {variant} />
      <MirStats totals={data.totals} {variant} />
      {#if variant === "story"}
        <div class="mir-share-lists">
          <MirTopList title="Most watched shows" items={data.shows} />
          <MirTopList title="Most watched movies" items={data.movies} />
        </div>
      {/if}
    </div>
  {/if}

  {#if variant === "open-graph"}
    {#if topItem}
      <img class="mir-share-poster" src={topItem.posterUrl} alt="" />
    {/if}
    <div class="trakt-mir-share-card" data-variant={variant}>
      {@render heading()}
      <MirStats totals={data.totals} {variant} />
      <div class="mir-share-tops">
        {#if topShow}
          <div class="mir-share-top">
            <span class="mir-share-top-label">Top show</span>
            <b class="mir-share-top-title">{topShow.title}</b>
          </div>
        {/if}
        {#if topMovie}
          <div class="mir-share-top">
            <span class="mir-share-top-label">Top movie</span>
            <b class="mir-share-top-title">{topMovie.title}</b>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</ShareCardFrame>

<style>
  .trakt-mir-share-card {
    position: relative;

    display: flex;
    flex-direction: column;

    color: #efefef;
  }

  .trakt-mir-share-card[data-variant="feed"] {
    align-items: center;
    justify-content: center;
    gap: 56px;

    width: 100%;
    height: 100%;
  }

  .trakt-mir-share-card[data-variant="story"] {
    position: absolute;
    top: 0;
    left: 54px;

    align-items: center;
    justify-content: space-between;

    box-sizing: border-box;
    width: 972px;
    height: 1536px;
    padding: 72px 56px;
  }

  .trakt-mir-share-card[data-variant="open-graph"] {
    justify-content: center;
    gap: 32px;

    flex: 1;
    min-width: 0;
    margin-left: 44px;
  }

  .mir-share-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mir-share-heading {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .mir-share-label {
    display: flex;
    align-items: baseline;
    gap: 8px;

    font-size: 26px;
    color: rgba(239, 239, 239, 0.7);
  }

  .mir-share-label-name {
    max-width: 360px;

    font-weight: bold;
    color: #efefef;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mir-share-period {
    margin: 0;

    font-size: 56px;
    line-height: 60px;
    font-weight: bold;
  }

  .trakt-mir-share-card[data-variant="story"] .mir-share-period {
    font-size: 72px;
    line-height: 78px;
  }

  .mir-share-lists {
    display: flex;
    gap: 48px;

    width: 860px;
  }

  .mir-share-poster {
    width: 351px;
    height: 530px;

    border-radius: 12px;
  }

  .mir-share-tops {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .mir-share-top {
    display: flex;
    align-items: baseline;
    gap: 14px;
  }

  .mir-share-top-label {
    flex-shrink: 0;
    width: 150px;

    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(239, 239, 239, 0.6);
  }

  .mir-share-top-title {
    font-size: 34px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
