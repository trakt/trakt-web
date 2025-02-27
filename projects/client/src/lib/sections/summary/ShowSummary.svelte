<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaStats } from "$lib/requests/models/MediaStats";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import EpisodeCard from "$lib/sections/lists/components/EpisodeCard.svelte";
  import { useShowProgress } from "$lib/stores/useShowProgress";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import SeasonList from "../lists/SeasonList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/media/MediaSummaryProps";

  type ShowSummaryProps = MediaSummaryProps<ShowEntry> & {
    stats: MediaStats;
    studios: MediaStudio[];
    crew: MediaCrew;
    seasons: Season[];
  };

  const {
    media,
    ratings,
    stats,
    watchers,
    studios,
    intl,
    crew,
    seasons,
    streamOn,
  }: ShowSummaryProps = $props();

  const { progress } = $derived(useShowProgress(media.slug));

  const episode = $derived($progress);
</script>

<MediaSummary
  {media}
  {ratings}
  {stats}
  {watchers}
  {studios}
  {intl}
  {crew}
  {streamOn}
  type="show"
>
  {#snippet contextualContent()}
    <RenderFor device={["desktop"]} audience="authenticated">
      {#if episode != null}
        <EpisodeCard {episode} show={media} variant="next" />
      {/if}
    </RenderFor>
  {/snippet}
</MediaSummary>

<CastList title={m.actors()} cast={crew.cast} slug={media.slug} />

<SeasonList show={media} {seasons} />

<Comments {media} type="show" />

<RelatedList title={m.related_shows_title()} slug={media.slug} type="show" />

<!-- TODO: move back to designed position when we have faster queries -->
<Lists slug={media.slug} title={media.title} type="show" />
