<script lang="ts">
  import AvatarStack from "$lib/components/avatar-stack/AvatarStack.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
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
      <span class="pill-avatars">
        <AvatarStack {avatars} mobileLimit={3} />
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
    --pill-avatar-size: var(--ni-28);

    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    height: var(--ni-36);
    max-width: 100%;
    min-width: 0;
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

  .pill-avatars {
    display: inline-flex;
    pointer-events: none;
    flex: 0 0 auto;

    margin-inline-end: var(--ni-4);
  }

  // When the pill sits in an opted-in container, size it to the space
  // available: `100cqi` is the container's inline size, minus any inline space
  // the container reserves for siblings the pill must not sit under
  // (`--avatar-pill-reserved-inline`). The avatar overlap then scales from the
  // preferred 50% while there's room toward ~78% as the space narrows, so all
  // avatars stay visible without overflowing. Inert when no `avatar-pill`
  // container ancestor exists.
  @container avatar-pill (min-width: 0px) {
    .trakt-avatar-pill {
      --pill-available: calc(
        100cqi - var(--avatar-pill-reserved-inline, 0px)
      );

      max-width: var(--pill-available);
    }

    .pill-avatars {
      --avatar-stack-overlap: calc(
        -1 *
          clamp(
            var(--pill-avatar-size) * 0.5,
            var(--pill-avatar-size) * 0.78 -
              (var(--pill-available) - 210px) * 0.5,
            var(--pill-avatar-size) * 0.78
          )
      );
    }
  }

  .pill-label {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    height: var(--height-pill-label);
    min-width: 0;
    flex: 0 1 auto;
    padding-inline-end: var(--ni-4);

    &.is-text-only {
      padding-inline: var(--ni-8);
    }
  }

  .pill-text {
    opacity: 0.85;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pill-count {
    flex: 0 0 auto;
    font-variant-numeric: tabular-nums;
  }

  .pill-caret {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;

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
