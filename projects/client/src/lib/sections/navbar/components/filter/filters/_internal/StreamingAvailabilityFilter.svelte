<script lang="ts">
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import type { ListFilter as ListFilterModel } from "$lib/features/filters/models/Filter";
  import ListFilter from "../ListFilter.svelte";
  import StreamingServiceSelectLogo from "./StreamingServiceSelectLogo.svelte";
  import { useStreamingServiceOptions } from "./useStreamingServiceOptions";

  const { filter }: { filter: ListFilterModel } = $props();

  const options = useStreamingServiceOptions();
  const baseOptions = $derived(
    $options.hasFavorites
      ? filter.options
      : filter.options.filter((option) => option.value !== "favorites"),
  );
  const logoSources = $derived(
    new Map(
      $options.top
        .filter((brand) => brand.hasLogo)
        .map((brand) => [brand.slugs.join(","), brand.source]),
    ),
  );

  const augmentedFilter = $derived.by((): ListFilterModel => ({
    ...filter,
    options: [
      ...baseOptions,
      ...$options.top.map((brand) => ({
        label: () => brand.name,
        value: brand.slugs.join(","),
      })),
    ],
  }));

  function hasServiceLogo(option: SelectOption): boolean {
    return logoSources.has(option.value);
  }
</script>

{#snippet serviceLogo(option: SelectOption)}
  <StreamingServiceSelectLogo source={logoSources.get(option.value) ?? option.value} />
{/snippet}

<ListFilter
  filter={augmentedFilter}
  optionLeading={serviceLogo}
  hasOptionLeading={hasServiceLogo}
/>
