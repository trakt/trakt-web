<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import { toTranslatedVideoType } from "$lib/utils/formatting/string/toTranslatedVideoType";

  type VideoTypeDropdownProps = {
    types: Array<MediaVideo["type"]>;
    active: MediaVideo["type"];
    onchange: (type: MediaVideo["type"]) => void;
  };

  const { types, active, onchange }: VideoTypeDropdownProps = $props();

  const options = $derived(
    types.map((type) => ({
      value: type,
      label: toTranslatedVideoType(type),
    })),
  );
</script>

{#if types.length > 1}
  <SingleSelect
    {options}
    value={active}
    placeholder={m.dropdown_label_extras()}
    autoWidth
    onChange={(value) => onchange(value as MediaVideo["type"])}
  />
{/if}
