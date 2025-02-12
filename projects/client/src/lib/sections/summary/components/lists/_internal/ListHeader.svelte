<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import UserAvatar from "../../_internal/UserAvatar.svelte";
  import UserProfileLink from "../../_internal/UserProfileLink.svelte";
  const { list }: { list: MediaListSummary } = $props();
</script>

<div class="trakt-list-header">
  <UserAvatar src={list.user.avatar.url} name={list.user.username} />

  <div class="list-name-and-creator">
    <p class="secondary bold ellipsis">
      {list.name}
    </p>
    <div class="list-credits">
      <p class="secondary small">{m.by()}</p>
      <UserProfileLink slug={list.user.slug} name={list.user.username} />
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
