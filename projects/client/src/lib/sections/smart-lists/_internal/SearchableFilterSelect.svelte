<script lang="ts">
  import MultiSelect from "$lib/components/select/MultiSelect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { MIN_FILTER_OPTION_QUERY_LENGTH } from "$lib/requests/queries/smart-lists/minFilterOptionQueryLength.ts";
  import type { MultiSelectSelection } from "$lib/components/select/models/MultiSelectSelection.ts";
  import { fromMultiSelectSelection } from "$lib/features/filters/fromMultiSelectSelection.ts";
  import { toMultiSelectSelection } from "$lib/features/filters/toMultiSelectSelection.ts";
  import type { SmartListFilterOptionKind } from "$lib/requests/models/SmartListFilterOptionKind.ts";
  import { toTitleCaseSlug } from "$lib/utils/formatting/string/toTitleCaseSlug.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { untrack } from "svelte";
  import { useSmartListFilterOptions } from "./useSmartListFilterOptions.ts";

  type SearchableFilterSelectProps = {
    kind: SmartListFilterOptionKind;
    values: ReadonlyArray<string>;
    placeholder: string;
    searchPlaceholder: string;
    disabled?: boolean;
    onChange: (values: string[]) => void;
  };

  const {
    kind,
    values,
    disabled = false,
    placeholder,
    searchPlaceholder,
    onChange,
  }: SearchableFilterSelectProps = $props();

  let search = $state("");
  let knownLabels = $state<Record<string, string>>({});

  const { options: results, isLoading } = useSmartListFilterOptions({
    kind: untrack(() => kind),
    query$: fromRune(() => search),
  });

  const emptyLabel = $derived(
    search.trim().length < MIN_FILTER_OPTION_QUERY_LENGTH
      ? m.text_smart_list_filter_search_hint()
      : m.text_smart_list_filter_no_results(),
  );

  const selection = $derived(toMultiSelectSelection(values.join(",")));

  const options = $derived.by(() => {
    const resultValues = new Set($results.map((option) => option.value));
    const selected = [...selection.included, ...selection.excluded]
      .filter((value) => !resultValues.has(value))
      .map((value) => ({
        value,
        label: knownLabels[value] ?? toTitleCaseSlug(value),
      }));

    return [...selected, ...$results];
  });

  const onSelectionChange = (next: MultiSelectSelection) => {
    knownLabels = {
      ...knownLabels,
      ...Object.fromEntries($results.map(({ value, label }) => [value, label])),
    };

    onChange(fromMultiSelectSelection(next)?.split(",") ?? []);
  };
</script>

<MultiSelect
  {options}
  included={selection.included}
  excluded={selection.excluded}
  {placeholder}
  {searchPlaceholder}
  {emptyLabel}
  {disabled}
  isLoading={$isLoading}
  variant="chip"
  onSearch={(query) => (search = query)}
  onChange={onSelectionChange}
/>
