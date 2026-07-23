<script lang="ts">
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import type { SelectVariant } from "$lib/components/select/models/SelectVariant.ts";
  import { DISCOVER_MODE_PARAM } from "$lib/features/filters/_internal/constants";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";
  import { buildParamString } from "$lib/utils/url/buildParamString";

  // selected-label (default): small screens - icon squares, active option shows
  // its label. compact (filter drawer): icon-only squares. Large screens get the
  // segmented control from the persistent NavbarContentToggle instead.
  const { variant = "selected-label" }: { variant?: SelectVariant } = $props();

  const { mode: selectedType, onModeChange, options } = useDiscover();

  const segmentedOptions = $derived(
    options.map((option) => ({
      value: option.value,
      label: option.text(),
      href: buildParamString({ [DISCOVER_MODE_PARAM]: option.value }),
    })),
  );
</script>

<GlobalParameterSetter parameter={DISCOVER_MODE_PARAM}>
  <SegmentedSelect
    {variant}
    value={$selectedType}
    options={segmentedOptions}
    onChange={(value) => onModeChange(value as DiscoverMode)}
  >
    {#snippet icon(option: SelectOption)}
      {#if option.value === "media"}<MediaIcon />{/if}
      {#if option.value === "show"}<ShowIcon />{/if}
      {#if option.value === "movie"}<MovieIcon />{/if}
    {/snippet}
  </SegmentedSelect>
</GlobalParameterSetter>
