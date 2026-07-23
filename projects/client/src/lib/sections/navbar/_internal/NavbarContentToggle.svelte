<script lang="ts">
  import { page } from "$app/state";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import { DISCOVER_MODE_PARAM } from "$lib/features/filters/_internal/constants";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import { useSearchMode } from "$lib/features/search/useSearchMode";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { SearchMode } from "$lib/requests/queries/search/models/SearchMode";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { resolveContentToggle } from "./resolveContentToggle.ts";

  const config = $derived(resolveContentToggle(page.route.id));
  const surface = $derived(config?.surface ?? null);

  // Both providers wrap the navbar in the root layout, so both are always in
  // scope. The observables are cold until read, so the inactive surface costs
  // nothing.
  const { mode: discoverMode, onModeChange } = useDiscover();
  const { mode: searchMode } = useSearchMode();

  const searchQuery = $derived(page.url.searchParams.get("q") ?? "");

  const searchLabel: Record<SearchMode, () => string> = {
    media: m.button_text_toggle_search_media,
    show: m.button_text_shows,
    movie: m.button_text_movies,
    people: m.button_text_toggle_search_people,
    lists: m.button_text_toggle_search_lists,
  };

  const discoverLabel: Record<DiscoverMode, () => string> = {
    media: m.button_text_media,
    show: m.button_text_shows,
    movie: m.button_text_movies,
  };

  // Always the same 5 keyed options AND always anchors on both surfaces: an
  // href-less option would render as a <button>, and swapping element type on
  // the surface flip remounts the segment mid-animation (a visible flicker).
  // Discover: filter-aware ?mode= hrefs; collapsed People/Lists carry inert
  // /search deep links (unreachable while folded). Search: ?m= hrefs that keep
  // the live query - the URL drives selection on both surfaces.
  const options = $derived.by<SegmentedSelectOption[]>(() => {
    if (surface === "search") {
      return (["media", "show", "movie", "people", "lists"] as const).map(
        (value) => ({
          value,
          label: searchLabel[value](),
          href: buildParamString({
            m: value,
            ...(searchQuery ? { q: searchQuery } : {}),
          }),
        }),
      );
    }

    return [
      ...(["media", "show", "movie"] as const).map((value) => ({
        value,
        label: discoverLabel[value](),
        href: buildParamString({ [DISCOVER_MODE_PARAM]: value }),
      })),
      ...(["people", "lists"] as const).map((value) => ({
        value,
        label: searchLabel[value](),
        href: `${UrlBuilder.search()}${buildParamString({ m: value })}`,
      })),
    ];
  });

  const value = $derived(surface === "search" ? $searchMode : $discoverMode);

  const onChange = (next: string) => {
    // Search-surface anchors own their navigation (?m= drives the state via
    // SearchProvider); only discover needs the store update + analytics.
    if (surface === "search") return;
    onModeChange(next as DiscoverMode);
  };
</script>

{#if config}
  <!--
    The audience gate mirrors the legacy per-page toggles (public profiles kept
    theirs member-only). GlobalParameterSetter is always mounted (stable DOM);
    its `mode` override is used by the discover anchors' appendGlobalParameters
    and simply idle on the search surface, where the options are buttons.
  -->
  <RenderFor audience={config.audience}>
    <GlobalParameterSetter parameter={DISCOVER_MODE_PARAM}>
      <!--
        The navbar actions bar vertically centers its children, so a growing
        panel would spill half its extra height above the bar. The wrapper
        shifts the open panel down by half the extension height so the option
        row stays put and growth reads downward, matching the design.
      -->
      <div
        class="trakt-navbar-content-toggle"
        class:is-open={surface === "search"}
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
  </RenderFor>
{/if}

{#snippet contentIcon(option: SelectOption)}
  {#if option.value === "media"}<MediaIcon />{/if}
  {#if option.value === "show"}<ShowIcon />{/if}
  {#if option.value === "movie"}<MovieIcon />{/if}
  {#if option.value === "people"}<PeopleIcon />{/if}
  {#if option.value === "lists"}<ListIcon />{/if}
{/snippet}

{#snippet searchExtension()}
  <SearchInput variant="embedded" />
{/snippet}

<style lang="scss">
  .trakt-navbar-content-toggle {
    // Half the panel extension height (see .segment-extension in
    // SegmentedSelect - keep in sync).
    --extension-shift: calc((var(--ni-40) + var(--ni-4)) / 2);

    display: flex;

    // Transition lives on the open state only: the shift eases in with the
    // panel, but SNAPS back on close so the revert has no vertical motion
    // competing with the X-axis refold (it read as a bounce).
    // Deliberately NOT transitioned: the extension row mounts/unmounts in a
    // single layout pass, so this shift and the bar's recentering land in the
    // same frame and cancel arithmetically - the option row never moves
    // vertically. Animating either side lets them tear by a frame (a dip).
    &.is-open {
      transform: translateY(var(--extension-shift));
    }
  }
</style>
