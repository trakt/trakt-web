<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SeasonActions from "./SeasonActions.svelte";
  import type { SeasonPopupMenuProps } from "./SeasonPopupMenuProps.ts";

  const { title, episodes, show, seasonId, disabled }: SeasonPopupMenuProps =
    $props();
</script>

<PopupMenu
  label={m.button_label_popup_menu({ title })}
  mode="standalone"
  {title}
  {disabled}
>
  {#snippet items()}
    <SeasonActions
      {title}
      {episodes}
      {show}
      {seasonId}
      isLoading={disabled}
    />
  {/snippet}
</PopupMenu>
