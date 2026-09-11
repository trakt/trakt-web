<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { GifEntry } from "$lib/requests/models/GifEntry.ts";
  import { useDebouncedValue } from "$lib/stores/useDebouncedValue.ts";
  import { GIF_SEARCH_DEBOUNCE } from "./_internal/constants.ts";
  import GifCategories from "./_internal/GifCategories.svelte";
  import GifResults from "./_internal/GifResults.svelte";
  import { klipyCustomerId } from "./klipyCustomerId.ts";

  type GifPickerDrawerHostProps = {
    onClose: () => void;
    onSelect: (gif: GifEntry) => void;
  };

  const { onClose, onSelect }: GifPickerDrawerHostProps = $props();

  const customerId = klipyCustomerId();

  let searchTerm = $state("");

  const debouncedTerm = useDebouncedValue<string>(GIF_SEARCH_DEBOUNCE);
  $effect(() => {
    debouncedTerm.set(searchTerm.trim());
  });

  const query = $derived($debouncedTerm ?? "");

  // Klipy hears about the gif only once the comment carrying it is posted.
  const select = (gif: GifEntry) => {
    onSelect(gif);
    onClose();
  };
</script>

<Drawer
  {onClose}
  title={m.drawer_title_add_gif()}
  size="large"
  elevated
>
  <div class="trakt-gif-picker-drawer-host">
    <!-- Top margin so the focus ring is not clipped by the drawer's scroll box. -->
    <DrawerSearchInput
      bind:value={searchTerm}
      label={m.input_label_search_gifs()}
      placeholder={m.input_placeholder_search_gifs()}
      --drawer-search-input-margin-block="var(--ni-4) 0"
    />

    {#if !query}
      <GifCategories {customerId} onSelect={(term) => (searchTerm = term)} />
    {/if}

    <!-- Keyed so each term builds its query observer once, at setup. -->
    {#key query}
      <GifResults {customerId} {query} onSelect={select} />
    {/key}
  </div>
</Drawer>

<style lang="scss">
  .trakt-gif-picker-drawer-host {
    --color-input-focus: var(--color-link-active);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
