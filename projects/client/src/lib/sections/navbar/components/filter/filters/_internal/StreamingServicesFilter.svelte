<script lang="ts">
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import type { AdvancedMultiSelectFilter } from "$lib/features/filters/models/Filter";
  import * as m from "$lib/features/i18n/messages.ts";
  import MultiSelectFilter from "./MultiSelectFilter.svelte";
  import StreamingServiceSelectLogo from "./StreamingServiceSelectLogo.svelte";
  import { useStreamingServiceOptions } from "./useStreamingServiceOptions";

  const { filter }: { filter: AdvancedMultiSelectFilter } = $props();

  const options = useStreamingServiceOptions();
  const servicesWithLogo = $derived(
    new Set(
      $options.all
        .filter((option) => option.hasLogo)
        .map((option) => option.source),
    ),
  );
  const baseOptions = $derived(
    $options.hasFavorites
      ? filter.options
      : filter.options.filter((option) => option.value !== "favorites"),
  );

  const augmentedFilter = $derived.by((): AdvancedMultiSelectFilter => ({
    ...filter,
    advanced: {
      ...filter.advanced,
      label: filter.advanced.label ?? filter.label,
      options: [
        ...baseOptions,
        ...$options.all.map((option) => ({
          label: () => option.name,
          value: option.source,
        })),
      ],
    },
  }));

  function hasServiceLogo(option: SelectOption): boolean {
    return servicesWithLogo.has(option.value);
  }
</script>

{#snippet serviceLogo(option: SelectOption)}
  <StreamingServiceSelectLogo source={option.value} />
{/snippet}

<MultiSelectFilter
  filter={augmentedFilter}
  searchPlaceholder={m.input_placeholder_filter()}
  emptyLabel={m.text_no_services_match_filter()}
  optionLeading={serviceLogo}
  hasOptionLeading={hasServiceLogo}
/>
