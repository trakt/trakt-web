<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName.ts";
  import { SvelteSet } from "svelte/reactivity";
  import FavoriteServiceTile from "./FavoriteServiceTile.svelte";
  import { toCountrySlugs } from "./toCountrySlugs.ts";
  import { useStreamingServices } from "./useStreamingServices.ts";

  const { onClose }: { onClose: () => void } = $props();

  const { country, favorites, countrySources, saveFavorites } =
    useStreamingServices();
  const { confirm } = useConfirm();

  // Only autofocus the filter on pointer devices. On touch, autofocus pops the
  // keyboard and scrolls the sheet, hiding the first row's tiles and their
  // overlaid check badges.
  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  let filter = $state("");
  let isSaving = $state(false);

  const countryCode = $country;
  const countryName = toCountryName(countryCode, languageTag());

  const initialSlugs = toCountrySlugs($favorites, countryCode);

  const selected = new SvelteSet<string>(initialSlugs);
  // Snapshot of the slugs that were already favorites when the drawer opened,
  // used purely for ordering so the grid doesn't reshuffle as items are toggled.
  const preselectedSlugs: ReadonlySet<string> = new Set(initialSlugs);

  const favoriteServicesLimit = 5;

  const hasChanges = $derived(
    selected.size !== preselectedSlugs.size ||
      [...selected].some((s) => !preselectedSlugs.has(s)),
  );
  const isAtLimit = $derived(selected.size >= favoriteServicesLimit);

  const normalizedFilter = $derived(filter.trim().toLowerCase());

  const visibleSources = $derived.by(() => {
    const filtered = ($countrySources ?? []).filter((source) =>
      source.name.toLowerCase().includes(normalizedFilter),
    );

    // Float the items that were already favorites when the drawer opened to the
    // top (keeping their alphabetical order); everything else stays alphabetical.
    return [
      ...filtered.filter((source) => preselectedSlugs.has(source.source)),
      ...filtered.filter((source) => !preselectedSlugs.has(source.source)),
    ];
  });

  const toggle = (slug: string) => {
    if (selected.has(slug)) {
      selected.delete(slug);
    } else if (!isAtLimit) {
      selected.add(slug);
    }
  };

  function handleClose() {
    if (!hasChanges) {
      onClose();
      return;
    }

    confirm({
      type: ConfirmationType.DiscardChanges,
      onConfirm: onClose,
    })();
  }

  const onSave = async () => {
    isSaving = true;
    try {
      await saveFavorites(countryCode, [...selected]);
      onClose();
    } finally {
      isSaving = false;
    }
  };
</script>

{#snippet actions()}
  <ActionButton
    label={m.button_label_apply()}
    color="purple"
    disabled={isSaving || !hasChanges}
    onclick={onSave}
  >
    <CheckIcon />
  </ActionButton>
{/snippet}

<Drawer
  onClose={handleClose}
  title={m.label_favorites()}
  metaInfo={m.text_services_selected({
    count: selected.size,
    total: ($countrySources ?? []).length,
    country: countryName,
  })}
  size="large"
  classList="trakt-favorite-services-drawer-host"
  {actions}
>
  <div class="trakt-favorite-services-drawer">
    <div class="filter-bar">
      <FormInput
        placeholder={m.input_placeholder_filter_services()}
        value={filter}
        onChange={(value) => (filter = value)}
        disabled={false}
        autofocus={$isMouse}
      />
      <p
        class="limit-label small secondary italic"
        class:invisible={!isAtLimit}
      >
        {m.text_favorites_limit_reached({ limit: favoriteServicesLimit })}
      </p>
    </div>

    {#if visibleSources.length === 0}
      <p class="empty-state secondary">{m.text_no_services_match_filter()}</p>
    {:else}
      <div class="services-grid">
        {#each visibleSources as source (source.source)}
          <FavoriteServiceTile
            {source}
            isFavorite={selected.has(source.source)}
            disabled={isAtLimit && !selected.has(source.source)}
            onToggle={() => toggle(source.source)}
          />
        {/each}
      </div>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  // Tighten the drawer's content padding to match the main page's spacing
  // (--gap-s, the favorites grid gap). The filter bar tracks --drawer-padding,
  // so it stays aligned automatically.
  :global(.trakt-drawer.trakt-favorite-services-drawer-host) {
    --drawer-padding: var(--gap-s);
  }

  .trakt-favorite-services-drawer {
    display: flex;
    flex-direction: column;
    // Clear space between the sticky bar and the first row so the first
    // tile's top border and overlaid check are fully visible at rest.
    gap: var(--gap-m);
  }

  .filter-bar {
    position: sticky;
    top: 0;
    z-index: var(--layer-base);

    // Extend the solid background to the full drawer width (past the content
    // padding) so tiles are fully covered as they scroll under the bar.
    margin-inline: calc(-1 * var(--drawer-padding));
    padding-inline: var(--drawer-padding);
    padding-block: var(--gap-s);

    background: var(--color-drawer-background);
  }

  .limit-label {
    margin: 0;
    padding-top: var(--gap-xs);
    padding-right: var(--gap-xs);
    text-align: right;

    &.invisible {
      visibility: hidden;
    }
  }

  .empty-state {
    margin: 0;
    padding-block: var(--gap-l);
    text-align: center;
  }

  .services-grid {
    display: grid;
    // Adaptive column count: the 1fr tracks stretch to fill the content width,
    // so the grid's outer edges line up flush with the filter input above it. A
    // single gap token gives equal spacing on every side.
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-96), 1fr));
    gap: var(--gap-s);
  }
</style>
