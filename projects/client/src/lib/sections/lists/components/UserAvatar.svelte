<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TierAura from "$lib/components/tier-aura/TierAura.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useVipVeteranEnabled } from "$lib/features/vip-veteran/stores/useVipVeteranEnabled.ts";
  import { toVipTier } from "$lib/features/vip-veteran/toVipTier.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";

  type UserAvatarProps = {
    user: Pick<UserProfile, "avatar" | "slug" | "username" | "isVip"> &
      Partial<Pick<UserProfile, "veteran" | "isDirector">>;
    size?: "small" | "large";
    icon?: Snippet;
    onClick?: () => void;
    linked?: boolean;
    /** Inset where avatars overlap or get clipped, as in stacks. */
    auraVariant?: "compact" | "inset";
  };

  const {
    user,
    size = "large",
    icon,
    onClick,
    linked = true,
    auraVariant = "compact",
  }: UserAvatarProps = $props();

  const isAuraShown = useVipVeteranEnabled();
  const tier = $derived(toVipTier(user));
</script>

{#snippet face()}
  <CrossOriginImage
    src={user.avatar.url}
    alt={m.image_alt_user_avatar({ username: user.username })}
  />
{/snippet}

{#snippet avatar()}
  <div
    class="trakt-user-avatar"
    class:trakt-vip-user={user.isVip}
    class:has-aura={$isAuraShown && auraVariant === "compact"}
    data-size={size}
  >
    {#if $isAuraShown}
      <TierAura {tier} variant={auraVariant}>
        {@render face()}
      </TierAura>
    {:else}
      {@render face()}
    {/if}

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

    /* The aura is the frame; the photo loses its own stroke. */
    &.has-aura :global(img) {
      border: none;
    }
  }
</style>
