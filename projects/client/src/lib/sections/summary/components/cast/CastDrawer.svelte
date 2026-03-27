<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { fade } from "svelte/transition";
  import CastMemberItem from "../../../lists/components/CastMemberItem.svelte";

  const {
    onClose,
    cast,
    type,
  }: {
    cast: CastMember[];
    type: MediaType;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_actors()}
  size="large"
>
  {#if isOpen}
    <div class="cast-drawer-content" transition:fade={{ duration: 150 }}>
      <GridList
        id={`cast-list-${type}`}
        items={cast}
        --width-item="var(--width-person-card)"
      >
        {#snippet item(item)}
          <CastMemberItem castMember={item} {type} />
        {/snippet}
      </GridList>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .cast-drawer-content {
    display: contents;
  }
</style>
