<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ReactionTarget } from "$lib/requests/models/ReactionTarget";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { onMount } from "svelte";
  import MediaReactionPicker from "./_internal/MediaReactionPicker.svelte";
  import { prefetchReactionEmojis } from "./_internal/prefetchReactionEmojis";
  import ReactionsSummary from "./ReactionsSummary.svelte";
  import {
    MAX_MEDIA_REACTIONS,
    useMediaReactions,
  } from "./useMediaReactions";

  const { target }: { target: ReactionTarget } = $props();

  const target$ = fromRune(() => target);
  const { count, top, reactions, mine, recent, isReacting, react, remove } =
    useMediaReactions(target$);

  let isOpen = $state(false);

  onMount(prefetchReactionEmojis);

  const onToggle = (type: string) => {
    const held = $mine.find((reaction) => reaction.type === type);
    if (held) {
      remove({ target, id: held.id });
      return;
    }

    react({ target, type });
  };
</script>

{#snippet pill()}
  <span class="reactions-pill" class:has-summary={$count > 0}>
    {#if $count > 0}
      <span class="pill-summary">
        <ReactionsSummary top={$top} count={$count} density="compact" />
      </span>
      <span class="pill-summary-stacked">
        <ReactionsSummary top={$top} count={$count} density="stacked" />
      </span>
    {:else}
      <ReactionIcon state="add" />
    {/if}
  </span>
{/snippet}

{#snippet picker()}
  <MediaReactionPicker
    reactions={$reactions}
    recent={$recent}
    mine={$mine}
    max={MAX_MEDIA_REACTIONS}
    isReacting={$isReacting}
    {onToggle}
  />
{/snippet}

<div class="trakt-media-reactions-action">
  <RenderFor audience="all" device={["tablet-sm", "mobile"]}>
    <button
      class="reactions-button"
      aria-label={m.button_label_popup_reactions()}
      onclick={() => (isOpen = true)}
    >
      {@render pill()}
    </button>

    {#if isOpen}
      <Drawer onClose={() => (isOpen = false)} size="auto">
        {@render picker()}
      </Drawer>
    {/if}
  </RenderFor>

  <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
    <Popover open={isOpen} onOpenChange={(value) => (isOpen = value)}>
      {@render pill()}
      {#snippet content()}
        <div class="reactions-popover">
          {@render picker()}
        </div>
      {/snippet}
    </Popover>
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .reactions-button {
    all: unset;
  }

  .reactions-pill {
    user-select: none;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    // Same height as the ActionButtons beside it in the summary bar.
    height: var(--ni-40);
    min-width: var(--ni-40);
    width: fit-content;

    padding: var(--ni-8);
    box-sizing: border-box;

    border-radius: var(--border-radius-xxl);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color;

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }

    &.has-summary {
      padding-inline-end: var(--ni-10);
    }

    @include for-mouse {
      &:hover {
        background-color: var(--color-reaction-background-hover);
        cursor: pointer;
      }
    }

    .pill-summary {
      display: contents;
    }

    .pill-summary-stacked {
      display: none;
    }

    // Five buttons already fill the poster-width bar here, so the top three
    // stack instead of sitting side by side.
    @include for-tablet-sm-and-below {
      gap: var(--ni-4);
      padding: var(--ni-6);

      .pill-summary {
        display: none;
      }

      .pill-summary-stacked {
        display: contents;
      }
    }
  }

  .reactions-popover {
    width: var(--ni-360);
    padding: var(--ni-8);
    box-sizing: border-box;
    max-height: 80vh;
    overflow-y: auto;

    background-color: var(--color-reaction-background);
    border-radius: var(--border-radius-xxl);
    box-shadow: var(--shadow-menu);
  }
</style>
