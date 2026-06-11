<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";

  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import WhereToWatchList from "../lists/where-to-watch/WhereToWatchList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import MediaSummaryV2 from "./components/media/v2/MediaSummary.svelte";
  import Sentiment from "./components/sentiment/Sentiment.svelte";
  import TriviaList from "./components/trivia/TriviaList.svelte";
  import type { CommonMediaSummaryProps } from "./models/CommonMediaSummaryProps";
  import SummaryDrawer from "./SummaryDrawer.svelte";

  const {
    media,
    studios,
    intl,
    crew,
    streamOn,
    videos,
    sentiment,
    watchers,
  }: {
    media: MovieEntry;
    studios: MediaStudio[];
    videos: MediaVideo[];
    sentiment: SentimentAnalysis | Nil;
    watchers: UserProfile[];
  } & CommonMediaSummaryProps = $props();

  const relatedLink = $derived(UrlBuilder.related.movie(media.slug));
  const listsLink = $derived(UrlBuilder.popularLists.movie(media.slug));
</script>

<SummaryDrawer {sentiment} {studios} {crew} {media} {videos} type="movie" />

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <MediaSummaryV2 {media} {studios} {crew} {intl} type="movie" />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <MediaSummary {media} {intl} {streamOn} {crew} type="movie">
    {#snippet contextualContent()}
      <RenderFor audience="all" device={["desktop"]}>
        <WhereToWatchList type="movie" {media} {streamOn} variant="inline" />
        <Sentiment
          {sentiment}
          slug={media.slug}
          variant="inline"
          type="movie"
        />
      </RenderFor>
    {/snippet}
  </MediaSummary>
</RenderFor>

<RenderFor audience="all" device={["mobile", "tablet-sm", "tablet-lg"]}>
  <WhereToWatchList type="movie" {media} {streamOn} />
  <Sentiment {sentiment} slug={media.slug} type="movie" />
</RenderFor>

<RenderFor audience="authenticated">
  {#if watchers.length > 0}
    <SectionList
      id={{ scope: "people-watched", key: media.slug }}
      items={watchers}
      title={m.list_title_people_watched()}
      --height-list="var(--ni-64)"
    >
      {#snippet item(user)}
        <div class="people-watched-item">
          <UserAvatar {user} size="small" />
          <p class="bold ellipsis">{toDisplayableName(user)}</p>
        </div>
      {/snippet}
    </SectionList>
  {/if}
</RenderFor>

<CastList
  title={m.list_title_actors()}
  cast={crew.cast}
  slug={media.slug}
  type={media.type}
/>

<Comments {media} type="movie" />

<VideoList slug={media.slug} {videos} type="movie" />

<RelatedList
  title={m.list_title_related_movies()}
  slug={media.slug}
  type="movie"
  drilldownLink={relatedLink}
/>

<!-- TODO: move back to designed position when we have faster queries -->
<Lists
  slug={media.slug}
  title={media.title}
  type="movie"
  drilldownLink={listsLink}
/>

<TriviaList {media} />

<style lang="scss">
  .people-watched-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);
    width: var(--ni-56);
  }
</style>
