<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { user }: { user: UserProfile } = $props();
</script>

{#if user.isDeleted}
  <p class="secondary small trakt-deleted-user">{m.deleted_user()}</p>
{:else}
  <Link href={UrlBuilder.og.user(user.slug)} target="_blank">
    <p class="secondary small ellipsis">
      {user.username}
    </p>
  </Link>
{/if}

<style>
  .trakt-deleted-user {
    color: var(--shade-700);
  }
</style>
