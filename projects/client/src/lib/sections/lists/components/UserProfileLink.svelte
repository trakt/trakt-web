<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import { assertDefined } from "$lib/utils/assert/assertDefined";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
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
  <p class="secondary ellipsis">
    {toDisplayableName(user)}
  </p>
{/snippet}

{#if displayType === "deleted"}
  <p class="secondary trakt-deleted-user">{m.text_deleted_username()}</p>
{/if}

{#if displayType === "linkable"}
  <Link href={UrlBuilder.profile.user(assertDefined(user.slug))}>
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
