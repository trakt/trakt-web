<script lang="ts">
  import IndicatorTags from "$lib/components/tags/IndicatorTags.svelte";
  import WatchedTag from "$lib/components/media/tags/WatchedTag.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import type { TodayTitleStory } from "../models/TodayTitleStory.ts";
  import TodayMilestoneChip from "./TodayMilestoneChip.svelte";
  import TodayTile from "./TodayTile.svelte";
  import TodayTileFaces from "./TodayTileFaces.svelte";
  import { hasWatchedToo } from "./hasWatchedToo.ts";
  import { toFriendActionText } from "./toFriendActionText.ts";
  import { toMilestoneLabel } from "./toMilestoneLabel.ts";


  const { story, onOpen }: { story: TodayTitleStory; onOpen: () => void } =
    $props();

  const { history } = useUser();

  const isWatchedToo = $derived(
    hasWatchedToo({ history: $history, media: story.media }),
  );
  const label = $derived(
    [
      story.media.title,
      story.milestone ? toMilestoneLabel(story.milestone) : null,
      isWatchedToo ? m.tag_text_today_watched_too() : null,
    ].filter((part) => part != null).join(", "),
  );

  const latest = $derived(story.actions.at(0));
  const subtitle = $derived.by(() => {
    if (story.users.length > 1) {
      return m.text_today_friends_other({ count: story.users.length });
    }
    return latest ? toFriendActionText(latest) : "";
  });
</script>

<TodayTile {label} {onOpen}>
  <CardCover
    title={story.media.title}
    src={story.media.poster.url.thumb}
    alt={m.image_alt_media_poster({ title: story.media.title })}
  >
    {#snippet badge()}
      <div class="tile-badge">
        {#if story.milestone}
          <div class="tile-milestone">
            <TodayMilestoneChip milestone={story.milestone} variant="icon" />
          </div>
        {/if}
        <TodayTileFaces users={story.users} />
      </div>
    {/snippet}
    {#snippet tag()}
      {#if story.averageRating != null}
        <div class="tile-rating">
          <UserRating rating={story.averageRating} size="small" />
        </div>
      {/if}
    {/snippet}
  </CardCover>
  {#if isWatchedToo}
    <IndicatorTags>
      <WatchedTag />
    </IndicatorTags>
  {/if}
  <CardFooter>
    <p class="trakt-card-title ellipsis">{story.media.title}</p>
    <p class="trakt-card-subtitle ellipsis">{subtitle}</p>
  </CardFooter>
</TodayTile>

<style>
  .tile-badge {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }

  .tile-milestone {
    margin-inline-end: auto;
  }

  .tile-rating {
    margin-inline-start: auto;
  }
</style>
