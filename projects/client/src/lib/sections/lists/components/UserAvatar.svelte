<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toVipVeteranRingTone } from "$lib/features/vip-veteran/toVipVeteranRingTone.ts";
  import { useVipVeteranEnabled } from "$lib/features/vip-veteran/stores/useVipVeteranEnabled.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";

  type UserAvatarProps = {
    user: Pick<UserProfile, "avatar" | "slug" | "username" | "isVip"> &
      Partial<Pick<UserProfile, "veteran">>;
    size?: "small" | "large";
    icon?: Snippet;
    onClick?: () => void;
    linked?: boolean;
  };

  const {
    user,
    size = "large",
    icon,
    onClick,
    linked = true,
  }: UserAvatarProps = $props();

  const isVeteranEnabled = useVipVeteranEnabled();
  const ringTone = $derived(
    $isVeteranEnabled && user.isVip ? toVipVeteranRingTone(user.veteran) : null,
  );
</script>

{#snippet avatar()}
  <div
    class="trakt-user-avatar"
    class:trakt-vip-user={user.isVip}
    data-size={size}
    data-ring-tone={ringTone}
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

{#if linked && user.slug}
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
        border: var(--ni-2) solid var(--color-border-vip-avatar);
      }
    }

    &[data-ring-tone="copper"] :global(img) {
      border-color: var(--color-border-vip-avatar-copper);
    }

    &[data-ring-tone="silver"] :global(img) {
      border-color: var(--color-border-vip-avatar-silver);
    }

    &[data-ring-tone="gold"] :global(img) {
      border-color: var(--color-border-vip-avatar-gold);
    }
  }
</style>
