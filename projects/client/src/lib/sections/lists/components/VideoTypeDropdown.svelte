<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import { toTranslatedVideoType } from "$lib/utils/formatting/string/toTranslatedVideoType";

  type VideoTypeDropdownProps = {
    types: Array<MediaVideo["type"]>;
    active: MediaVideo["type"];
    onchange: (type: MediaVideo["type"]) => void;
  };

  const { types, active, onchange }: VideoTypeDropdownProps = $props();
</script>

{#if types.length > 1}
  <DropdownList label={m.dropdown_label_extras()}>
    {toTranslatedVideoType(active)}
    {#snippet items()}
      {#each types as type}
        <DropdownItem color="blue" onclick={() => onchange(type)}>
          {toTranslatedVideoType(type)}
        </DropdownItem>
      {/each}
    {/snippet}
  </DropdownList>
{/if}
