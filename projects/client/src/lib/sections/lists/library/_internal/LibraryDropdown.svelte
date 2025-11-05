<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";

  const {
    selectedLibrary,
    libraries,
    onChange,
  }: {
    selectedLibrary: string;
    libraries: string[];
    onChange: (library: string) => void;
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
  {toTranslatedValue("library", selectedLibrary)}
  {#snippet items()}
    {#each libraries as library}
      <DropdownItem color="blue" onclick={() => onChange(library)}>
        {toTranslatedValue("library", library)}
      </DropdownItem>
    {/each}
  {/snippet}
</DropdownList>
