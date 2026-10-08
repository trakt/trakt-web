<script lang="ts">
  import ReactionPicker from "$lib/components/reactions/ReactionPicker.svelte";
  import ReactionsDistribution from "$lib/components/reactions/ReactionsDistribution.svelte";
  import { toReactionPickerOptions } from "$lib/components/reactions/toReactionPickerOptions.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { MAX_MEDIA_REACTIONS } from "$lib/features/media-reactions/MAX_MEDIA_REACTIONS.ts";
  import {
    type MediaReaction,
    MediaReactionSchema,
  } from "$lib/requests/models/MediaReaction.ts";
  import type { ReactionsPopoverContentProps } from "./ReactionsPopoverContentProps.ts";

  const {
    chosen,
    onSelect,
    distribution,
    isLoading,
    close,
  }: ReactionsPopoverContentProps = $props();

  const QUICK_REACTIONS: ReadonlyArray<MediaReaction> = [
    "heart_eyes",
    "rofl",
    "holding_back_tears",
    "mind_blown",
    "shocked",
    "yawning",
  ];

  const DISTRIBUTION_PAGE_SIZE = 8;

  let isExpanded = $state(false);

  const options = toReactionPickerOptions([
    ...QUICK_REACTIONS,
    ...MediaReactionSchema.options.filter(
      (reaction) => !QUICK_REACTIONS.includes(reaction),
    ),
  ]);

  const reacted = $derived(
    MediaReactionSchema.options.filter(
      (reaction) => (distribution[reaction] ?? 0) > 0,
    ),
  );

  function selectHandler(reaction: MediaReaction) {
    const isFilling = !chosen.includes(reaction) &&
      chosen.length + 1 >= MAX_MEDIA_REACTIONS;

    onSelect(reaction);

    if (isFilling) close();
  }
</script>

{#if reacted.length > 0}
  <div class="popover-ranking" class:is-folded={isExpanded}>
    <div class="popover-ranking-body">
      <ReactionsDistribution
        reactions={reacted}
        {distribution}
        current={chosen}
        {isLoading}
        title={m.header_media_reactions()}
        order="ranked"
        pageSize={DISTRIBUTION_PAGE_SIZE}
      />
    </div>
  </div>
{/if}

<ReactionPicker
  {options}
  {chosen}
  limit={MAX_MEDIA_REACTIONS}
  onSelect={selectHandler}
  quickCount={QUICK_REACTIONS.length}
  {isExpanded}
  onToggleExpanded={() => (isExpanded = !isExpanded)}
/>

<style lang="scss">
  .popover-ranking {
    display: grid;
    grid-template-rows: 1fr;

    transition:
      grid-template-rows calc(var(--transition-increment) * 2)
        cubic-bezier(0.22, 1, 0.36, 1),
      opacity var(--transition-increment) ease-out;

    &.is-folded {
      grid-template-rows: 0fr;
      opacity: 0;
    }
  }

  .popover-ranking-body {
    min-height: 0;
    overflow: hidden;
  }
</style>
