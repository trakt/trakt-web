<script lang="ts">
  import { page } from "$app/state";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import ToggleIcon from "$lib/components/toggles/ToggleIcon.svelte";
  import { DISCOVER_MODE_PARAM } from "$lib/features/filters/_internal/constants";
  import { discoverModeOptions } from "$lib/features/filters/discoverModeOptions.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import { searchModeOptions } from "$lib/features/search/searchModeOptions.ts";
  import { useSearchMode } from "$lib/features/search/useSearchMode";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { ContentToggleSurface } from "./ContentToggleSurface.ts";

  const { surface }: { surface: ContentToggleSurface } = $props();

  const {
    mode: discoverMode,
    onModeChange,
    options: discoverOptions,
  } = useDiscover();
  const { mode: searchMode } = useSearchMode();

  const searchQuery = $derived(page.url.searchParams.get("q") ?? "");

  const options = $derived.by<SegmentedSelectOption[]>(() => {
    if (surface === "search") {
      return searchModeOptions().map((option) => ({
        ...option,
        href: buildParamString({
          m: option.value,
          ...(searchQuery ? { q: searchQuery } : {}),
        }),
      }));
    }

    return [
      ...discoverModeOptions(discoverOptions),
      ...searchModeOptions()
        .filter(({ value }) => value === "people" || value === "lists")
        .map((option) => ({
          ...option,
          href: `${UrlBuilder.search()}${buildParamString({ m: option.value })}`,
        })),
    ];
  });

  const value = $derived(surface === "search" ? $searchMode : $discoverMode);

  const onChange = (next: string) => {
    if (surface === "search") return;
    onModeChange(next as DiscoverMode);
  };
</script>

<GlobalParameterSetter parameter={DISCOVER_MODE_PARAM}>
  <div
    class="trakt-navbar-content-toggle"
    class:is-open={surface === "search"}
    role={surface === "search" ? "search" : undefined}
  >
    <SegmentedSelect
      expandable
      collapsedCount={2}
      expanded={surface === "search"}
      {options}
      {value}
      icon={contentIcon}
      extension={searchExtension}
      {onChange}
    />
  </div>
</GlobalParameterSetter>

{#snippet contentIcon(option: SegmentedSelectOption)}
  <ToggleIcon {option} />
{/snippet}

{#snippet searchExtension()}
  <SearchInput variant="embedded" />
{/snippet}

<style lang="scss">
  .trakt-navbar-content-toggle {
    --extension-shift: calc(var(--segmented-select-extension-height) / 2);
    --segmented-select-background: color-mix(
      in srgb,
      var(--color-background-navbar) 75%,
      transparent
    );

    display: flex;

    &.is-open {
      transform: translateY(var(--extension-shift));
    }
  }
</style>
