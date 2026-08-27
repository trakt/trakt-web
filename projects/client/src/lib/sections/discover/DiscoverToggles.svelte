<script lang="ts">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import type { SelectVariant } from "$lib/components/select/models/SelectVariant.ts";
  import ToggleIcon from "$lib/components/toggles/ToggleIcon.svelte";
  import { DISCOVER_MODE_PARAM } from "$lib/features/filters/_internal/constants";
  import { discoverModeOptions } from "$lib/features/filters/discoverModeOptions.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";

  type DiscoverTogglesProps = {
    variant?: SelectVariant;
  };

  const { variant = "selected-label" }: DiscoverTogglesProps = $props();

  const { mode: selectedType, onModeChange, options } = useDiscover();

  const segmentedOptions = $derived(discoverModeOptions(options));
</script>

<GlobalParameterSetter parameter={DISCOVER_MODE_PARAM}>
  <SegmentedSelect
    {variant}
    value={$selectedType}
    options={segmentedOptions}
    onChange={onModeChange}
  >
    {#snippet icon(option: SegmentedSelectOption)}
      <ToggleIcon {option} />
    {/snippet}
  </SegmentedSelect>
</GlobalParameterSetter>
