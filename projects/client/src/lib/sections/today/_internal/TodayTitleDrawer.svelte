<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { TodayTitleStory } from "../models/TodayTitleStory.ts";
  import TodayActionRow from "./TodayActionRow.svelte";
  import TodayCommentBubble from "./TodayCommentBubble.svelte";
  import { todayStoryNavigation } from "./todayStoryNavigation.ts";
  import { toFriendActionText } from "./toFriendActionText.ts";

  const { story, onClose }: { story: TodayTitleStory; onClose: () => void } =
    $props();

  const { storyLink } = todayStoryNavigation();
  const link = $derived(storyLink(story.key));
</script>

<Drawer {onClose} title={story.media.title} size="auto">
  <div class="trakt-today-title-drawer">
    {#each story.actions as action (action.key)}
      <TodayActionRow
        title={toDisplayableName(action.user)}
        detail={toFriendActionText(action)}
        rating={action.rating}
      >
        {#snippet lead()}
          <UserAvatar user={action.user} size="small" />
        {/snippet}
      </TodayActionRow>
      {#if action.comment}
        <TodayCommentBubble comment={action.comment} lines={3} />
      {/if}
    {/each}

    <div class="drawer-actions">
      <Button
        href={link.href}
        noscroll={link.noscroll}
        replacestate={link.replacestate}
        label={m.button_label_play_story({ title: story.media.title })}
        color="purple"
      >
        {m.button_text_play_story()}
      </Button>
      <Button
        href={UrlBuilder.media(story.media.type, story.media.slug)}
        label={story.media.title}
        variant="secondary"
        color="default"
      >
        {story.media.title}
      </Button>
    </div>
  </div>
</Drawer>

<style>
  .trakt-today-title-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .drawer-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xs);
    }
  }
</style>
