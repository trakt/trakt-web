<script lang="ts">
  import ReactionPickerCell from "$lib/components/reactions/ReactionPickerCell.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { MAX_MEDIA_REACTIONS } from "$lib/features/media-reactions/constants.ts";
  import type { MediaReaction } from "$lib/requests/models/MediaReaction.ts";
  import type { ReactionsDrawerProps } from "./ReactionsDrawerProps.ts";
  import { toMediaReactionOptions } from "./toMediaReactionOptions.ts";

  const { chosen, onSelect, onClose }: ReactionsDrawerProps = $props();

  const options = toMediaReactionOptions();

  const COLUMNS = 6;
  const toWaveIndex = (index: number) =>
    Math.floor(index / COLUMNS) + (index % COLUMNS);

  function selectHandler(reaction: MediaReaction) {
    const isFilling = !chosen.includes(reaction) &&
      chosen.length + 1 >= MAX_MEDIA_REACTIONS;

    onSelect(reaction);

    if (isFilling) onClose();
  }
</script>

<Drawer {onClose} title={m.header_media_reactions()} size="auto">
  <div class="trakt-reactions-drawer-grid" style:--drawer-columns={COLUMNS}>
    {#each options as option, index (option.id)}
      <ReactionPickerCell
        {option}
        index={toWaveIndex(index)}
        size="large"
        {chosen}
        limit={MAX_MEDIA_REACTIONS}
        onSelect={selectHandler}
      />
    {/each}
  </div>
</Drawer>

<style>
  .trakt-reactions-drawer-grid {
    display: grid;
    grid-template-columns: repeat(var(--drawer-columns), var(--ni-40));
    justify-content: space-between;
    row-gap: var(--gap-xs);

    padding-block: var(--ni-20) var(--gap-m);
  }
</style>
