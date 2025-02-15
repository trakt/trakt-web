<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { list, type }: { list: MediaListSummary; type?: MediaType } = $props();
</script>

<div class="trakt-list-header">
  <UserAvatar user={list.user} />

  <div class="list-name-and-creator">
    <Link href={UrlBuilder.users(list.user.slug).lists(list.slug, type)}>
      <p class="secondary bold ellipsis">
        {list.name}
      </p>
    </Link>
    <div class="list-credits">
      <p class="secondary small">{m.by()}</p>
      <UserProfileLink user={list.user} />
    </div>
  </div>
</div>

<style>
  .trakt-list-header {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
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
