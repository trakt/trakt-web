<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CassetteIcon from "$lib/components/icons/CassetteIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";

  type DefaultMediaPopupActionsProps = {
    media: MediaInputDefault;
    onListAction: () => void;
  };

  const { media, onListAction }: DefaultMediaPopupActionsProps = $props();
</script>

<WatchlistAction
  style="dropdown-item"
  title={media.title}
  type={media.type}
  {media}
/>
<MarkAsWatchedAction
  style="dropdown-item"
  title={media.title}
  type={media.type}
  {media}
/>
<ListAction
  style="dropdown-item"
  target={{ type: media.type, media }}
  title={media.title}
  onClick={onListAction}
/>
<RenderFor audience="authenticated">
  <DropdownItem
    href={UrlBuilder.mixtape({
      type: media.type,
      picks: [media.id],
      source: "poster-menu",
    })}
  >
    {m.button_text_start_mixtape_with_this()}
    {#snippet icon()}
      <CassetteIcon />
    {/snippet}
  </DropdownItem>
</RenderFor>
