<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import type { AvatarPillProps } from "./AvatarPillProps.ts";

  const {
    avatars,
    countLabel,
    label,
    ariaLabel,
    href,
    onclick,
    noscroll,
    replacestate,
  }: AvatarPillProps = $props();

  const hasAvatars = $derived(avatars.length > 0);
</script>

{#snippet pill()}
  <span class="trakt-avatar-pill">
    {#if hasAvatars}
      <span class="avatar-stack" aria-hidden="true">
        {#each avatars as avatar, index (avatar.key)}
          <span class="avatar" style:z-index={avatars.length - index}>
            <UserAvatar user={avatar.user} size="small" />
          </span>
        {/each}
      </span>
    {/if}

    <span class="pill-label" class:is-text-only={countLabel == null}>
      {#if countLabel != null}
        <span class="pill-count bold">{countLabel}</span>
      {/if}
      <span class="pill-text">{label}</span>
    </span>

    <span class="pill-caret" aria-hidden="true">
      <CaretRightIcon />
    </span>
  </span>
{/snippet}

{#if onclick != null}
  <button
    type="button"
    class="trakt-avatar-pill-button"
    {onclick}
    aria-label={ariaLabel}
  >
    {@render pill()}
  </button>
{:else}
  <Link {href} {noscroll} {replacestate} color="inherit" label={ariaLabel}>
    {@render pill()}
  </Link>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-link):has(.trakt-avatar-pill) {
    text-decoration: none;
  }

  .trakt-avatar-pill-button {
    appearance: none;
    background: none;
    border: 0;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: start;
  }

  .trakt-avatar-pill {
    --height-pill-label: calc(var(--font-size-text) + var(--ni-2));

    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    height: var(--ni-36);
    padding: 0 var(--ni-8);
    box-sizing: border-box;
    border-radius: var(--border-radius-xxl);

    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 40%, transparent);
    color: inherit;

    cursor: pointer;
    white-space: nowrap;

    transition:
      transform var(--transition-increment) ease-out,
      border-color var(--transition-increment) ease-out;

    &:active {
      transform: scale(0.97);
    }
  }

  .avatar-stack {
    display: inline-flex;
    align-items: center;
    pointer-events: none;

    margin-inline-end: var(--ni-4);

    // Trim the stack to 3 avatars on mobile to keep the pill narrow.
    @include for-mobile {
      .avatar:nth-child(n + 4) {
        display: none;
      }
    }
  }

  .avatar {
    --pill-avatar-size: var(--ni-28);

    position: relative;

    width: var(--pill-avatar-size);
    height: var(--pill-avatar-size);
    flex: 0 0 var(--pill-avatar-size);

    margin-inline-start: calc(var(--pill-avatar-size) * -0.5);

    border-radius: 50%;
    overflow: hidden;
    box-sizing: border-box;

    &:first-child {
      margin-inline-start: 0;
    }

    :global(.trakt-user-avatar) {
      width: var(--pill-avatar-size);
      height: var(--pill-avatar-size);

      :global(img) {
        border-width: var(--ni-1);
      }
    }
  }

  .pill-label {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    height: var(--height-pill-label);
    padding-inline-end: var(--ni-4);

    &.is-text-only {
      padding-inline: var(--ni-8);
    }
  }

  .pill-text {
    opacity: 0.85;
  }

  .pill-count {
    font-variant-numeric: tabular-nums;
  }

  .pill-caret {
    display: inline-flex;
    align-items: center;

    // Cancel the pill's flex gap so the caret sits flush against the label.
    margin-inline-start: calc(-1 * var(--ni-4));
    opacity: 0.55;

    transition:
      transform var(--transition-increment) ease-out,
      opacity var(--transition-increment) ease-out;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .trakt-avatar-pill:hover .pill-caret {
    opacity: 0.9;
    transform: translateX(calc(var(--rtl-sign) * var(--ni-2)));
  }
</style>
