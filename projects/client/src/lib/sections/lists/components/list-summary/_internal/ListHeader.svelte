<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import { getListUrl } from "./getListUrl";

  const { list, type }: { list: MediaListSummary; type?: MediaType } = $props();
</script>

<div class="trakt-list-header">
  <UserAvatar user={list.user} />

  <div class="list-name-and-creator">
    <Link href={getListUrl(list, type)}>
      <p class="secondary bold ellipsis">
        {list.name}
      </p>
    </Link>
    <div class="list-credits">
      <p class="secondary small">{m.text_by()}</p>
      <UserProfileLink user={list.user} />
    </div>
  </div>

  <ListActions {list} />
</div>

<style>
  .trakt-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;

    gap: var(--gap-xs);
  }

  .list-name-and-creator {
    display: grid;
    min-width: 0;
    flex-grow: 1;

    :global(.trakt-link) {
      min-width: 0;
    }
  }

  .list-credits {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;

    gap: var(--gap-xxs);
  }
</style>
