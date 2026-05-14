<script lang="ts">
  import Select from "$lib/components/select/Select.svelte";
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
      label: toTranslatedVideoType(type),
      value: type,
    })),
  );
</script>

{#if types.length > 1}
  <Select
    {options}
    value={active}
    constantWidth={true}
    variant="pill"
    placeholder={m.dropdown_label_extras()}
    onChange={(value) => onchange(value as MediaVideo["type"])}
  />
{/if}
