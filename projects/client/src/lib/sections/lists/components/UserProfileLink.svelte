<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import { assertDefined } from "$lib/utils/assert/assertDefined";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { user }: { user: UserProfile } = $props();

  const displayType = $derived.by(() => {
    if (user.isDeleted) {
      return "deleted";
    }

    if (user.slug) {
      return "linkable";
    }

    return "plain";
  });
</script>

{#snippet username()}
  <p class="secondary small ellipsis">
    {user.username}
  </p>
{/snippet}

{#if displayType === "deleted"}
  <p class="secondary small trakt-deleted-user">{m.deleted_user()}</p>
{/if}

{#if displayType === "linkable"}
  <Link href={UrlBuilder.og.user(assertDefined(user.slug))} target="_blank">
    {@render username()}
  </Link>
{/if}

{#if displayType === "plain"}
  {@render username()}
{/if}

<style>
  .trakt-deleted-user {
    color: var(--shade-700);
  }
</style>
