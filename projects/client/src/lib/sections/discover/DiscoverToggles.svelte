<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { DISCOVER_MODE_PARAM } from "$lib/features/discover/_internal/constants";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";
  import { buildParamString } from "$lib/utils/url/buildParamString";

  const { mode: selectedType, setMode, options } = useDiscover();

  const optionsWithHref = options.map((option) => ({
    ...option,
    href: buildParamString({ [DISCOVER_MODE_PARAM]: option.value }),
  }));
</script>

<GlobalParameterSetter parameter={DISCOVER_MODE_PARAM}>
  <Toggler
    value={$selectedType}
    variant="text"
    onChange={setMode}
    options={optionsWithHref}
  />
</GlobalParameterSetter>
