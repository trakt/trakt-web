<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import MediaSummaryItem from "$lib/sections/summary/components/media/MediaSummaryItem.svelte";
  import type { MediaCardProps } from "./MediaCardProps";

  const { media, tags, action, popupActions }: MediaCardProps = $props();
</script>

<trakt-media-summary-card>
  <Card
    --height-card="var(--height-summary-card)"
    --width-card="var(--width-summary-card)"
  >
    {#if popupActions}
      <CardActionBar>
        {#snippet actions()}
          <PopupMenu label={m.media_popup_label({ title: media.title })}>
            {#snippet items()}
              {@render popupActions()}
            {/snippet}
          </PopupMenu>
        {/snippet}
      </CardActionBar>
    {/if}
    <MediaSummaryItem {media} {tags} />
    <CardFooter {action} />
  </Card>
</trakt-media-summary-card>

<style>
  trakt-media-summary-card {
    :global(.trakt-card .trakt-card-footer) {
      padding: 0;
    }

    :global(.trakt-card .trakt-summary-item) {
      padding: var(--ni-12);
    }

    :global(.trakt-link) {
      text-decoration: none;
    }
  }
</style>
