<script lang="ts">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import ToggleIcon from "$lib/components/toggles/ToggleIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { searchModeOptions } from "./searchModeOptions.ts";
  import SearchInput from "./SearchInput.svelte";
  import { useSearchMode } from "./useSearchMode";

  type SearchModePanelProps = {
    withSearchInput?: boolean;
  };

  const { withSearchInput = true }: SearchModePanelProps = $props();

  const { mode, setMode } = useSearchMode();

  const options = $derived(searchModeOptions());
</script>

<div
  class="trakt-search-mode-panel"
  class:has-search-input={withSearchInput}
  role={withSearchInput ? "search" : undefined}
>
  <SegmentedSelect
    variant="selected-label"
    expandable
    expanded
    {options}
    value={$mode}
    ariaLabel={m.page_title_search()}
    icon={modeIcon}
    extension={withSearchInput ? searchExtension : undefined}
    onChange={setMode}
  />
</div>

{#snippet modeIcon(option: SelectOption)}
  <ToggleIcon {option} />
{/snippet}

{#snippet searchExtension()}
  <SearchInput variant="embedded" />
{/snippet}

<style lang="scss">
  .trakt-search-mode-panel {
    display: flex;

    :global(.trakt-segmented-select) {
      backdrop-filter: none;
    }

    &.has-search-input {
      width: 100%;

      :global(.trakt-segmented-select) {
        width: 100%;
      }
    }
  }
</style>
