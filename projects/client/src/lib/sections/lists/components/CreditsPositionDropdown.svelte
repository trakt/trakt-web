<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
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
</script>

<DropdownList
  label={m.dropdown_label_person_position()}
  preferNative
  style="flat"
  variant="primary"
  color="blue"
  size="small"
  disabled={allPositions.length <= 1}
>
  {toTranslatedPosition(selectedPosition)}
  {#snippet items()}
    {#each allPositions as position (position)}
      <DropdownItem color="blue" href={buildPositionHref(position)} noscroll>
        {toTranslatedPosition(position)}
      </DropdownItem>
    {/each}
  {/snippet}
</DropdownList>
