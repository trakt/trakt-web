<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import { fade } from "svelte/transition";
  import CastMemberItem from "../../../lists/components/CastMemberItem.svelte";

  const {
    onClose,
    cast,
    type,
  }: {
    cast: CastMember[];
    type: ExtendedMediaType;
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
  @use "$style/scss/mixins/index" as *;

  .cast-drawer-content {
    display: contents;

    --container-width: calc(var(--drawer-size) - 2 * var(--drawer-padding));
    --width-override-card: calc(
      (var(--container-width) - 3 * var(--list-gap)) / 3
    );
    --card-aspect-ratio: calc(
      var(--height-person-card-cover) / var(--min-person-card-width)
    );
    --height-override-card-cover: calc(
      var(--width-override-card) * var(--card-aspect-ratio)
    );
    --height-override-card: calc(
      var(--height-override-card-cover) + var(--height-card-footer)
    );

    @include for-mobile {
      --container-width: calc(100dvw - 2 * var(--drawer-padding));
    }

    :global(.trakt-list-item-container) {
      padding: 0;
    }

    :global(.trakt-list-items) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
