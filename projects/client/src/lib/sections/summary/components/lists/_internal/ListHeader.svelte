<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  const { list }: { list: MediaListSummary } = $props();
</script>

<div class="trakt-list-header">
  <div class="list-creator-avatar">
    <CrossOriginImage
      src={list.user.avatar.url}
      alt={m.users_avatar({ userName: list.user.userName })}
    />
  </div>

  <div class="list-name-and-creator">
    <p class="secondary bold ellipsis">
      {list.name}
    </p>
    <div class="list-credits">
      <p class="secondary small">{m.by()}</p>
      <Link href={UrlBuilder.og.user(list.user.slug)} target="_blank">
        <p class="secondary small ellipsis">
          {list.user.userName}
        </p>
      </Link>
    </div>
  </div>
</div>

<style>
  .trakt-list-header {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
  }

  .list-creator-avatar {
    width: var(--ni-36);
    height: var(--ni-36);
    flex-shrink: 0;

    :global(img) {
      border-radius: 50%;
      box-sizing: border-box;

      width: 100%;
      height: 100%;
    }
  }

  .list-name-and-creator {
    display: grid;
  }

  .list-credits {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;

    gap: var(--gap-xxs);
  }
</style>
