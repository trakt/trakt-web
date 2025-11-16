<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import type { MarkAsWatchedActionProps } from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedActionProps";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { WatchlistActionProps } from "$lib/sections/media-actions/watchlist/WatchListActionProps";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import type { Snippet } from "svelte";
  import MediaDetails from "../details/MediaDetails.svelte";
  import ListDropdown from "../list-dropdown/ListDropdown.svelte";
  import type { ListDropdownProps } from "../list-dropdown/ListDropdownProps";
  import { useAllPersonalLists } from "../list-dropdown/useAllPersonalLists";
  import MediaMetaInfo from "../media/MediaMetaInfo.svelte";
  import StreamOnOverlay from "../overlay/StreamOnOverlay.svelte";
  import TrailerOverlay from "../overlay/TrailerOverlay.svelte";
  import RateNow from "../rating/RateNow.svelte";
  import SummaryActions from "../summary/SummaryActions.svelte";
  import SummaryContainer from "../summary/SummaryContainer.svelte";
  import SummaryHeader from "../summary/SummaryHeader.svelte";
  import SummaryOverview from "../summary/SummaryOverview.svelte";
  import SummaryTitle from "../summary/SummaryTitle.svelte";
  import type { MediaSummaryProps } from "./MediaSummaryProps";
  import TrailerButton from "./v2/_internal/TrailerButton.svelte";

  const {
    media,
    type,
    intl,
    contextualContent,
    studios,
    crew,
    streamOn,
  }: MediaSummaryProps<MediaEntry> & {
    type: MediaType;
    contextualContent?: Snippet;
    studios: MediaStudio[];
    crew: MediaCrew;
  } = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const title = $derived(intl?.title ?? media?.title ?? "");
  const { watchCount } = $derived(useWatchCount({ media, type }));

  const commonProps = $derived({
    size: $isMobile ? ("small" as const) : ("normal" as const),
    title,
    type,
    media,
  });

  const { lists, isLoading } = useAllPersonalLists();

  const watchlistProps = $derived<WatchlistActionProps>({
    ...commonProps,
    style: "normal",
    isLoadingLists: $isLoading,
  });
  const listProps = $derived<ListDropdownProps>({
    ...commonProps,
    lists: $lists,
    isLoadingLists: $isLoading,
  });
  const markAsWatchedProps = $derived<MarkAsWatchedActionProps>({
    ...commonProps,
    style: "normal",
    allowRewatch: $watchCount > 0,
  });
</script>

{#snippet mediaActions()}
  <RenderFor audience="authenticated">
    {#if $lists.length === 0}
      <WatchlistAction {...watchlistProps} />
    {:else}
      <ListDropdown {...listProps} />
    {/if}
  </RenderFor>
  <MarkAsWatchedAction {...markAsWatchedProps} />
{/snippet}

<CoverImageSetter src={media.cover.url.medium} colors={media.colors} {type} />

<SummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      href={streamOn?.preferred?.link ?? media.trailer}
    >
      {#snippet hoverOverlay()}
        {#if streamOn?.preferred}
          <StreamOnOverlay service={streamOn.preferred} />
        {:else}
          <TrailerOverlay trailer={media.trailer} />
        {/if}
      {/snippet}
      {#snippet actions()}
        <RenderFor device={["tablet-lg", "desktop"]} audience="authenticated">
          {@render mediaActions()}
        </RenderFor>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <SummaryHeader {title}>
    {#snippet popupActions()}
      <RenderFor audience="authenticated">
        {#if media.type === "movie"}
          <CheckInAction style="dropdown-item" type="movie" {title} {media} />
        {/if}
      </RenderFor>
      <TrailerButton
        slug={media.slug}
        trailer={media.trailer}
        style="dropdown-item"
      />
      <SetCoverImageAction
        style="dropdown-item"
        type={media.type}
        id={media.id}
        {title}
      />
      <ShareButton
        {title}
        style="dropdown-item"
        textFactory={({ title }) => {
          switch (type) {
            case "movie":
              return m.text_share_movie({ title });
            case "show":
              return m.text_share_show({ title });
          }
        }}
        source={{ id: "media", type }}
      />
    {/snippet}

    <SummaryTitle {title} />
    <GenreList genres={media.genres} />
  </SummaryHeader>

  <MediaMetaInfo watchCount={$watchCount} {streamOn} {media} {type} />

  <Spoiler {media} {type}>
    <SummaryOverview {title} overview={intl.overview ?? media.overview} />
  </Spoiler>

  <RenderFor audience="authenticated">
    <SummaryActions>
      <RenderFor device={["tablet-sm", "mobile"]} audience="authenticated">
        {@render mediaActions()}
      </RenderFor>

      {#snippet contextualActions()}
        <RenderFor audience="authenticated">
          <RateNow {type} {media} />
        </RenderFor>
      {/snippet}
    </SummaryActions>
  </RenderFor>
</SummaryContainer>

<RenderFor audience="all">
  <SummaryContainer>
    <MediaDetails {media} {studios} {crew} {type} title={m.header_details()} />
  </SummaryContainer>
</RenderFor>
