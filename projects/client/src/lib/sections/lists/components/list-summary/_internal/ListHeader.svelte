<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListMeta from "$lib/sections/lists/components/ListMeta.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import { getListUrl } from "./getListUrl.ts";

  const {
    list,
    onclick,
  }: {
    list: MediaListSummary;
    onclick?: () => void;
  } = $props();

  const listUrl = $derived(getListUrl({ type: "user-list", list }));
</script>

<div class="trakt-list-header">
  <UserAvatar user={list.user} />

  <div class="list-content">
    <Link href={listUrl} {onclick}>
      <p class="secondary bold ellipsis">
        {list.name}
      </p>
    </Link>

    <ListMeta
      {list}
      countUrl={listUrl}
      onCountClick={onclick}
    />
  </div>

  <ListActions {list} />
</div>

<style lang="scss">
  .trakt-list-header {
    display: flex;
    align-items: center;

    width: 100%;
    min-width: 0;

    gap: var(--gap-xs);

    > :global(.trakt-link),
    > :global(.trakt-user-avatar) {
      display: flex;
      flex-shrink: 0;

      margin-inline-end: var(--ni-2);
    }
  }

  .list-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;

    gap: var(--gap-xxs);

    > :global(.trakt-link) {
      min-width: 0;
      max-width: 100%;
      align-self: flex-start;
    }
  }
</style>
