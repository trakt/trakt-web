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
  type="show"
>
  {#snippet contextualContent()}
    <RenderFor device={["desktop"]} audience="authenticated">
      {#if episode != null}
        <EpisodeCard {episode} show={media} type="next" />
      {/if}
    </RenderFor>
  {/snippet}
</MediaSummary>

<CastList title={m.actors()} cast={crew.cast} />

<SeasonList show={media} {seasons} />

<RelatedList title={m.related_shows_title()} slug={media.slug} type="show" />
