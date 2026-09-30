<script lang="ts">
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import type { AvatarStackProps } from "./AvatarStackProps.ts";

  const {
    avatars,
    size = "normal",
    variant = "default",
    linked = true,
    mobileLimit,
  }: AvatarStackProps = $props();
</script>

<span
  class="trakt-avatar-stack"
  data-size={size}
  data-variant={variant}
  aria-hidden="true"
>
  {#each avatars as avatar, index (avatar.key)}
    <span
      class="avatar"
      class:is-mobile-hidden={mobileLimit != null && index >= mobileLimit}
      style:z-index={variant === "default"
        ? avatars.length - index
        : undefined}
    >
      <UserAvatar user={avatar.user} size="small" {linked} />
    </span>
  {/each}
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-avatar-stack {
    --avatar-stack-base-size: var(--ni-28);
    --avatar-stack-size: var(--avatar-stack-base-size);

    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;

    &[data-size="small"] {
      --avatar-stack-base-size: var(--ni-22);
    }

    &[data-variant="cutout"] {
      --avatar-stack-size: calc(
        var(--avatar-stack-base-size) + 2 * var(--border-thickness-xs)
      );
      --avatar-stack-overlap: calc(-1 * var(--ni-8));

      .avatar :global(.trakt-user-avatar img) {
        border: var(--border-thickness-xs) solid var(--color-background);
      }
    }
  }

  .avatar {
    position: relative;

    width: var(--avatar-stack-size);
    height: var(--avatar-stack-size);
    flex: 0 0 var(--avatar-stack-size);

    margin-inline-start: var(
      --avatar-stack-overlap,
      calc(var(--avatar-stack-size) * -0.5)
    );

    border-radius: 50%;
    overflow: hidden;
    box-sizing: border-box;

    &:first-child {
      margin-inline-start: 0;
    }

    &.is-mobile-hidden {
      @include for-mobile {
        display: none;
      }
    }

    :global(.trakt-user-avatar) {
      width: var(--avatar-stack-size);
      height: var(--avatar-stack-size);

      :global(img) {
        border-width: var(--ni-1);
      }
    }
  }
</style>
