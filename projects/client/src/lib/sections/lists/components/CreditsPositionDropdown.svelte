<script lang="ts">
  import { goto } from "$app/navigation";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { CrewPosition } from "$lib/requests/models/CrewPosition";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";

  type CreditsPositionDropdownProps = {
    selectedPosition: CrewPosition;
    allPositions: CrewPosition[];
    buildPositionHref: (position: CrewPosition) => string;
  };

  const {
    selectedPosition,
    allPositions,
    buildPositionHref,
  }: CreditsPositionDropdownProps = $props();

  const options = $derived(
    allPositions.map((position) => ({
      value: position,
      label: toTranslatedPosition(position),
    })),
  );

  const onPositionChange = (value: string) => {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(buildPositionHref(value as CrewPosition), { noScroll: true });
  };
</script>

<SingleSelect
  {options}
  value={selectedPosition}
  placeholder={m.dropdown_label_person_position()}
  disabled={allPositions.length <= 1}
  autoWidth
  onChange={onPositionChange}
/>
