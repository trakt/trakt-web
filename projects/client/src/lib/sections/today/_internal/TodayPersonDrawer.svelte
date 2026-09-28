<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { TodayPersonGroup } from "../models/TodayPersonGroup.ts";
  import TodayActionRow from "./TodayActionRow.svelte";
  import TodayCommentBubble from "./TodayCommentBubble.svelte";
  import { toFriendActionText } from "./toFriendActionText.ts";

  const { group, onClose }: { group: TodayPersonGroup; onClose: () => void } =
    $props();

  const name = $derived(toDisplayableName(group.user));
</script>

<Drawer {onClose} title={name} size="auto">
  <div class="trakt-today-person-drawer">
    {#each group.actions as action (action.key)}
      <TodayActionRow
        title={action.media.title}
        detail={toFriendActionText(action)}
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
      </TodayActionRow>
      {#if action.comment}
        <TodayCommentBubble comment={action.comment} lines={3} />
      {/if}
    {/each}

    {#if group.user.slug}
      <div class="drawer-actions">
        <Button
          href={UrlBuilder.profile.user(group.user.slug)}
          label={name}
          variant="secondary"
          color="default"
        >
          {name}
        </Button>
      </div>
    {/if}
  </div>
</Drawer>

<style>
  .trakt-today-person-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

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

    .drawer-actions {
      display: flex;
    }
  }
</style>
