<script lang="ts">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SocialMediaLink } from "./SocialMediaLink";
  import SocialMediaLinks from "./SocialMediaLinks.svelte";

  const {
    inline,
    overflow,
  }: { inline: SocialMediaLink[]; overflow: SocialMediaLink[] } = $props();

  let isExpanded = $state(false);

  const label = $derived(
    isExpanded
      ? m.button_label_show_fewer_social_links()
      : m.button_label_show_more_social_links({ count: overflow.length }),
  );
</script>

<SocialMediaLinks links={isExpanded ? [...inline, ...overflow] : inline} />

{#if overflow.length > 0}
  <button
    class="trakt-social-media-expand"
    aria-label={label}
    aria-expanded={isExpanded}
    onclick={() => (isExpanded = !isExpanded)}
  >
    {#if isExpanded}
      <CaretLeftIcon />
    {:else}
      <span class="bold">+{overflow.length}</span>
      <CaretRightIcon />
    {/if}
  </button>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-social-media-expand {
    all: unset;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    height: var(--ni-24);
    padding-inline: var(--ni-10);
    box-sizing: border-box;
    flex-shrink: 0;

    border-radius: var(--border-radius-pill);
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 10%,
      transparent
    );
    color: var(--color-text-primary);

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, transform;

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid currentColor;
      outline-offset: var(--ni-2);
    }

    &:active {
      transform: scale(0.94);
    }

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 20%,
          transparent
        );
      }
    }
  }
</style>
