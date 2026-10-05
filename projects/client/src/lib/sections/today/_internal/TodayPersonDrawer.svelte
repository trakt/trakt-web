<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { TodayPersonGroup } from "../models/TodayPersonGroup.ts";
  import TodayActionRow from "./TodayActionRow.svelte";
  import TodayCommentBubble from "./TodayCommentBubble.svelte";
  import TodayDrawerHeader from "./TodayDrawerHeader.svelte";
  import { toFriendActionLabel } from "./toFriendActionLabel.ts";
  import { toFriendActionTime } from "./toFriendActionTime.ts";

  const { group, onClose }: { group: TodayPersonGroup; onClose: () => void } =
    $props();

  const name = $derived(toDisplayableName(group.user));
  const latest = $derived(group.actions.at(0));
  const storyCount = $derived(
    group.actions.length === 1
      ? m.text_today_stories_one()
      : m.text_today_stories_other({ count: group.actions.length }),
  );
</script>

<Drawer {onClose} size="auto">
  <div class="trakt-today-person-drawer">
    {#if latest}
      <TodayDrawerHeader
        href={group.user.slug
          ? UrlBuilder.profile.user(group.user.slug)
          : UrlBuilder.media(latest.media.type, latest.media.slug)}
        cover={latest.media.cover.url.medium}
        title={name}
        meta={storyCount}
      >
        {#snippet lead()}
          <UserAvatar user={group.user} />
        {/snippet}
      </TodayDrawerHeader>
    {/if}

    <ul class="drawer-timeline">
      {#each group.actions as action (action.key)}
        <TodayActionRow
          title={action.media.title}
          action={toFriendActionLabel(action)}
          time={toFriendActionTime(action.activityAt)}
          rating={action.rating}
        >
          {#snippet lead()}
            <Link
              href={UrlBuilder.media(action.media.type, action.media.slug)}
              label={action.media.title}
            >
              <div class="drawer-poster">
                <CrossOriginImage src={action.media.poster.url.thumb} alt="" />
              </div>
            </Link>
          {/snippet}
          {#if action.comment}
            <TodayCommentBubble comment={action.comment} lines={3} />
          {/if}
        </TodayActionRow>
      {/each}
    </ul>
  </div>
</Drawer>

<style>
  .trakt-today-person-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    .drawer-poster {
      width: var(--ni-40);
      aspect-ratio: 2 / 3;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius-xs);
      }
    }

    .drawer-timeline {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);

      margin: 0;
      padding: 0;
      list-style: none;
    }
  }
</style>
