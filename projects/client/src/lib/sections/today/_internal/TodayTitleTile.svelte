<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import type { TodayTitleStory } from "../models/TodayTitleStory.ts";
  import TodayMilestoneChip from "./TodayMilestoneChip.svelte";
  import TodayTile from "./TodayTile.svelte";
  import TodayTileFaces from "./TodayTileFaces.svelte";
  import { toFriendActionText } from "./toFriendActionText.ts";

  const { story, onOpen }: { story: TodayTitleStory; onOpen: () => void } =
    $props();

  const latest = $derived(story.actions.at(0));
  const subtitle = $derived.by(() => {
    if (story.users.length > 1) {
      return m.text_today_friends_other({ count: story.users.length });
    }
    return latest ? toFriendActionText(latest) : "";
  });
</script>

<TodayTile label={story.media.title} {onOpen}>
  <CardCover
    title={story.media.title}
    src={story.media.poster.url.thumb}
    alt={m.image_alt_media_poster({ title: story.media.title })}
  >
    {#snippet badge()}
      <TodayTileFaces users={story.users} />
    {/snippet}
    {#snippet tag()}
      {#if story.milestone}
        <TodayMilestoneChip milestone={story.milestone} size="small" />
      {/if}
      {#if story.averageRating != null}
        <UserRating rating={story.averageRating} size="small" />
      {/if}
    {/snippet}
  </CardCover>
  <CardFooter>
    <p class="trakt-card-title ellipsis">{story.media.title}</p>
    <p class="trakt-card-subtitle ellipsis">{subtitle}</p>
  </CardFooter>
</TodayTile>
