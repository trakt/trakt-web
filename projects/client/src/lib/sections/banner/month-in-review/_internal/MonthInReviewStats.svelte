<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import Stat from "$lib/components/stat/Stat.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserReview } from "$lib/requests/queries/users/monthInReviewQuery";

  const { review, isLoading }: { review?: UserReview; isLoading: boolean } =
    $props();
</script>

<div class="trakt-mir-stats">
  <Stat {isLoading}>
    {#snippet icon()}
      <PlayIcon />
    {/snippet}
    {m.text_play_count({ count: review?.playCount ?? 0 })}
  </Stat>

  <Stat {isLoading}>
    {#snippet icon()}
      <ClockIcon />
    {/snippet}
    {m.text_hours_watched({ count: review?.hoursWatched ?? 0 })}
  </Stat>
</div>

<style>
  .trakt-mir-stats {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
