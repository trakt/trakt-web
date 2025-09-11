<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";

  type UserAvatarProps = {
    user: UserProfile;
    size?: "small" | "large";
    icon?: Snippet;
    onClick?: () => void;
  };

  const { user, size = "large", icon, onClick }: UserAvatarProps = $props();
</script>

{#snippet avatar()}
  <div
    class="trakt-user-avatar"
    class:trakt-vip-user={user.isVip}
    data-size={size}
  >
    <CrossOriginImage
      src={user.avatar.url}
      alt={m.image_alt_user_avatar({ username: user.username })}
    />

    {#if icon}
      {@render icon()}
    {/if}
  </div>
{/snippet}

{#if user.slug}
  <Link href={UrlBuilder.profile.user(user.slug)} onclick={onClick}>
    {@render avatar()}
  </Link>
{:else}
  {@render avatar()}
{/if}

<style>
  .trakt-user-avatar {
    width: var(--ni-44);
    height: var(--ni-44);
    flex-shrink: 0;

    &[data-size="small"] {
      width: var(--ni-32);
      height: var(--ni-32);
    }

    :global(img) {
      border-radius: 50%;
      box-sizing: border-box;

      width: 100%;
      height: 100%;

      border: var(--ni-2) solid var(--shade-10);
    }

    &.trakt-vip-user {
      :global(img) {
        border: var(--ni-2) solid var(--color-background-vip-border);
      }
    }
  }
</style>
