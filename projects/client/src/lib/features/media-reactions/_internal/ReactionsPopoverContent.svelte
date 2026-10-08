<script lang="ts">
  import ReactionPicker from "$lib/components/reactions/ReactionPicker.svelte";
  import ReactionsDistribution from "$lib/components/reactions/ReactionsDistribution.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    MAX_MEDIA_REACTIONS,
    QUICK_MEDIA_REACTIONS,
  } from "$lib/features/media-reactions/constants.ts";
  import { MediaReactionSchema } from "$lib/requests/models/MediaReaction.ts";
  import type { ReactionsPopoverContentProps } from "./ReactionsPopoverContentProps.ts";
  import { toMediaReactionOptions } from "./toMediaReactionOptions.ts";

  const {
    chosen,
    onSelect,
    distribution,
    isLoading,
    onMore,
  }: ReactionsPopoverContentProps = $props();

  const DISTRIBUTION_PAGE_SIZE = 8;

  let isExpanded = $state(false);

  const options = toMediaReactionOptions();

  const reacted = $derived(
    MediaReactionSchema.options.filter(
      (reaction) => (distribution[reaction] ?? 0) > 0,
    ),
  );
</script>

{#if reacted.length > 0}
  <div
    class="popover-ranking"
    class:is-folded={isExpanded}
    inert={isExpanded}
  >
    <div class="popover-ranking-body">
      <ReactionsDistribution
        reactions={reacted}
        {distribution}
        current={chosen}
        {isLoading}
        title={m.header_media_reactions()}
        order="ranked"
        pageSize={DISTRIBUTION_PAGE_SIZE}
        format="share"
        onRemove={onSelect}
      />
    </div>
  </div>
{/if}

<ReactionPicker
  {options}
  {chosen}
  limit={MAX_MEDIA_REACTIONS}
  {onSelect}
  quickCount={QUICK_MEDIA_REACTIONS.length}
  {isExpanded}
  onToggleExpanded={onMore ?? (() => (isExpanded = !isExpanded))}
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
