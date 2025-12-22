<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import LibraryIcon from "$lib/components/icons/LibraryIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import RatingsIcon from "$lib/components/icons/RatingsIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { UserReview } from "$lib/requests/queries/users/monthInReviewQuery";
  import YirStat from "./YirStat.svelte";

  const { review }: { review: UserReview } = $props();
</script>

<div class="trakt-yir-stats">
  <YirStat value={review.playCount} label="Plays">
    <PlayIcon />
  </YirStat>

  <YirStat value={review.hoursWatched} label="Hours">
    <ClockIcon />
  </YirStat>

  <YirStat value={review.ratingsCount} label="Ratings">
    <RatingsIcon />
  </YirStat>

  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    <YirStat value={review.libraryCount} label="Library items">
      <LibraryIcon />
    </YirStat>
  </RenderFor>

  <YirStat value={review.commentsCount} label="Comments">
    <CommentIcon />
  </YirStat>

  <RenderFor audience="all" device={["mobile", "tablet-sm", "desktop"]}>
    <YirStat value={review.listsCount} label="Lists">
      <ListIcon />
    </YirStat>
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-stats {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    flex-grow: 1;
    justify-content: space-around;

    @include for-tablet-sm-and-below {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }
  }
</style>
