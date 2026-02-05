<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { toTranslatedLibrary } from "$lib/utils/formatting/string/toTranslatedLibrary";
  import type { Library } from "../models/Library";

  const {
    selectedLibrary,
    libraries,
    onChange,
  }: {
    selectedLibrary: Library;
    libraries: Library[];
    onChange: (library: Library) => void;
  } = $props();
</script>

<DropdownList
  preferNative
  label={m.dropdown_label_library()}
  style="flat"
  variant="primary"
  color="blue"
  text="capitalize"
  size="small"
  navigationType={DpadNavigationType.Item}
>
  {toTranslatedLibrary(selectedLibrary)}
  {#snippet items()}
    {#each libraries as library}
      <DropdownItem color="blue" onclick={() => onChange(library)}>
        {toTranslatedLibrary(library)}
      </DropdownItem>
    {/each}
  {/snippet}
</DropdownList>
