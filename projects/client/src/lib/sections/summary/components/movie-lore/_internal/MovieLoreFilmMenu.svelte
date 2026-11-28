<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { LoreMovie } from "$lib/requests/models/LoreMovie.ts";
  import DefaultMediaPopupActions from "$lib/sections/lists/components/DefaultMediaPopupActions.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { useLoreMovieEntry } from "../useLoreMovieEntry.ts";

  const { film }: { film: LoreMovie } = $props();

  const entry = useLoreMovieEntry(fromRune(() => film.slug));
</script>

<span class="trakt-movie-lore-film-menu">
  {#if $entry}
    {@const media = $entry}
    <PopupMenu
      label={m.button_label_popup_menu({ title: film.title })}
      mode="standalone"
      title={film.title}
    >
      {#snippet items()}
        <DefaultMediaPopupActions {media} />
      {/snippet}
    </PopupMenu>
  {/if}
</span>

<style lang="scss">
  .trakt-movie-lore-film-menu {
    display: flex;
    flex-shrink: 0;
    width: var(--ni-24);
    height: var(--ni-24);
  }
</style>
