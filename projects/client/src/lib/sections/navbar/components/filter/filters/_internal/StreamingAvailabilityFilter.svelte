<script lang="ts">
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import type { ListFilter as ListFilterModel } from "$lib/features/filters/models/Filter.ts";
  import ListFilter from "../ListFilter.svelte";
  import { omitEmptyFavoritesOption } from "./omitEmptyFavoritesOption.ts";
  import StreamingServiceSelectLogo from "./StreamingServiceSelectLogo.svelte";
  import { useStreamingServiceOptions } from "./useStreamingServiceOptions.ts";

  const { filter }: { filter: ListFilterModel } = $props();

  const toBrandValue = (slugs: ReadonlyArray<string>) => slugs.join(",");

  const options = useStreamingServiceOptions();
  const baseOptions = $derived(
    omitEmptyFavoritesOption(filter.options, $options.hasFavorites),
  );
  const logoSources = $derived(
    new Map(
      $options.top
        .filter((brand) => brand.hasLogo)
        .map((brand) => [toBrandValue(brand.slugs), brand.source]),
    ),
  );

  const augmentedFilter = $derived.by((): ListFilterModel => ({
    ...filter,
    options: [
      ...baseOptions,
      ...$options.top.map((brand) => ({
        label: () => brand.name,
        value: toBrandValue(brand.slugs),
        icon: brand.hasLogo ? serviceLogo : undefined,
      })),
    ],
  }));
</script>

{#snippet serviceLogo(option: SelectOption)}
  {@const source = logoSources.get(option.value)}
  {#if source}
    <StreamingServiceSelectLogo {source} />
  {/if}
{/snippet}

<ListFilter filter={augmentedFilter} />
