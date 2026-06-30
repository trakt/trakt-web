<script lang="ts">
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import type { AdvancedMultiSelectFilter } from "$lib/features/filters/models/Filter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import MultiSelectFilter from "./MultiSelectFilter.svelte";
  import { omitEmptyFavoritesOption } from "./omitEmptyFavoritesOption.ts";
  import StreamingServiceSelectLogo from "./StreamingServiceSelectLogo.svelte";
  import { useStreamingServiceOptions } from "./useStreamingServiceOptions.ts";

  const { filter }: { filter: AdvancedMultiSelectFilter } = $props();

  const options = useStreamingServiceOptions();
  const baseOptions = $derived(
    omitEmptyFavoritesOption(filter.options, $options.hasFavorites),
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
          icon: option.hasLogo ? serviceLogo : undefined,
        })),
      ],
    },
  }));
</script>

{#snippet serviceLogo(option: SelectOption)}
  <StreamingServiceSelectLogo source={option.value} />
{/snippet}

<MultiSelectFilter
  filter={augmentedFilter}
  searchPlaceholder={m.input_placeholder_filter()}
  emptyLabel={m.text_no_services_match_filter()}
/>
