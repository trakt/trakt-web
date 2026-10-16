<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import ListPrivacySwitch from "$lib/sections/lists/components/ListPrivacySwitch.svelte";
  import { toDefaultListPrivacy } from "$lib/sections/lists/toDefaultListPrivacy.ts";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { FILTER_KEYS } from "$lib/features/filters/filterKeys";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import type { SmartListFilters } from "$lib/requests/models/SmartListFilters.ts";
  import type { UserLimits } from "$lib/requests/models/UserLimits";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { iffy } from "$lib/utils/function/iffy";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { untrack } from "svelte";
  import Filter from "../navbar/components/filter/filters/Filter.svelte";
  import FilterGroup from "../navbar/components/filter/filters/FilterGroup.svelte";
  import FilterTabs from "../navbar/components/filter/FilterTabs.svelte";
  import LimitWarning from "./_internal/LimitWarning.svelte";
  import MediaTypeToggler from "./_internal/MediaTypeToggler.svelte";
  import TargetDropdown from "./_internal/TargetDropdown.svelte";
  import TargetPreview from "./_internal/TargetPreview.svelte";
  import SmartListRecipe from "./_internal/SmartListRecipe.svelte";
  import { FilterKey } from "$lib/features/filters/models/Filter.ts";
  import { toSmartListFilterMode } from "./toSmartListFilterMode";
  import { toSmartListFilters } from "./toSmartListFilters.ts";
  import { toExtraSmartListFilters } from "./toExtraSmartListFilters.ts";
  import { fromSmartListTemplateParams } from "./fromSmartListTemplateParams.ts";
  import { toListTarget } from "./toListTarget.ts";
  import { isSameSmartListFilters } from "./isSameSmartListFilters.ts";
  import { toSmartListExtrasForType } from "./toSmartListExtrasForType.ts";
  import { fromSmartListExtraParams } from "./fromSmartListExtraParams.ts";
  import { toSmartListExtraUrl } from "./toSmartListExtraUrl.ts";
  import SmartListMoreFilters from "./_internal/SmartListMoreFilters.svelte";
  import SmartListMatchFilter from "./_internal/SmartListMatchFilter.svelte";
  import type { FilterSettingsResolver } from "$lib/sections/navbar/components/filter/filters/FilterSettingsResolver.ts";
  import { withSmartListFilter } from "./withSmartListFilter.ts";
  import { ListTarget } from "./models/ListTarget";
  import { toDiscoverMode } from "../lists/smart/toDiscoverMode";
  import { useCreateSmartList } from "./useCreateSmartList";
  import { useUpdateSmartList } from "./useUpdateSmartList";

  const { mode, limits, list }: {
    mode: DiscoverMode;
    limits: UserLimits;
    list?: SmartList;
  } = $props();

  const { createList, isCreating } = useCreateSmartList();
  const { updateList, isUpdating } = useUpdateSmartList();
  const { filterMap } = useFilter();
  const { user } = useUser();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const { confirm } = useConfirm();

  const limit = iffy(() =>
    $user.isVip ? limits.dynamicLists.vip : limits.dynamicLists.free,
  );

  const toFilterParams = (url: URL) =>
    JSON.stringify(FILTER_KEYS.map((key) => url.searchParams.get(key)));

  const templatePrefill = untrack(() =>
    fromSmartListTemplateParams(page.url.searchParams),
  );

  const toUrlFilters = () =>
    toSmartListFilters(
      Object.fromEntries(
        FILTER_KEYS.flatMap((key) => {
          const value = page.url.searchParams.get(key);
          return value ? [[key, value]] : [];
        }),
      ),
    );

  const toInitialFilterMode = () => {
    const urlExtras = fromSmartListExtraParams(page.url.searchParams);
    if (Object.keys(urlExtras).length > 0) return FilterMode.Advanced;
    if (!list) {
      return templatePrefill.target
        ? toSmartListFilterMode(toUrlFilters())
        : FilterMode.Simple;
    }

    return toSmartListFilterMode(list.filters);
  };

  const initial = untrack(() => ({
    name: list?.title ?? templatePrefill.name ?? "",
    type: list ? toDiscoverMode(list.mediaType) : mode,
    target: list
      ? toListTarget(list.source)
      : (templatePrefill.target ?? ListTarget.Trending),
    filterMode: toInitialFilterMode(),
    filters: toFilterParams(page.url),
    privacy: list?.privacy ?? toDefaultListPrivacy($user),
  }));

  const initialExtras = untrack(() => {
    if (list) return toExtraSmartListFilters(list.filters);
    if (!templatePrefill.target) return {};

    return toSmartListExtrasForType({
      filters: fromSmartListExtraParams(page.url.searchParams),
      type: initial.type,
    });
  });

  let listName = $state(initial.name);
  let privacy = $state<SmartList["privacy"]>(initial.privacy);
  const extraFilters = $derived(fromSmartListExtraParams(page.url.searchParams));

  const setExtraFilters = (filters: SmartListFilters) =>
    goto(toSmartListExtraUrl({ url: page.url, filters }), {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  let type = $state<DiscoverMode>(initial.type);
  let activeMode = $state(initial.filterMode);
  let target = $state<ListTarget | undefined>(initial.target);

  const settingsFor: FilterSettingsResolver = (key) =>
    key === FilterKey.Genres
      ? {
        content: genreSettings,
        isModified: extraFilters.genres_operator != null,
      }
      : undefined;

  const typedExtras = $derived(
    toSmartListExtrasForType({ filters: extraFilters, type }),
  );
  const hasExtraFilters = $derived(
    Object.values(typedExtras).some((value) =>
      Array.isArray(value) ? value.length > 0 : value != null
    ),
  );

  const appliedExtras = $derived(
    activeMode === FilterMode.Advanced ? typedExtras : {},
  );

  const goBack = () => {
    goto(
      list
        ? UrlBuilder.lists.smart.view(list.slug)
        : UrlBuilder.lists.user("me"),
    );
  };

  const hasChanges = $derived(
    listName !== initial.name ||
      privacy !== initial.privacy ||
      type !== initial.type ||
      target !== initial.target ||
      toFilterParams(page.url) !== initial.filters ||
      !isSameSmartListFilters(appliedExtras, initialExtras),
  );

  const requestClose = () => {
    if (!hasChanges) {
      goBack();
      return;
    }

    confirm({
      type: ConfirmationType.DiscardChanges,
      onConfirm: goBack,
    })();
  };

  const onActiveModeChange = (to: string) => {
    activeMode = to as FilterMode;
  };

  const onSaveHandler = async () => {
    const slug = list
      ? await updateList({
        slug: list.slug,
        name: listName,
        type,
        target,
        filterMap: $filterMap,
        baseFilters: appliedExtras,
        privacy,
      })
      : await createList({
        name: listName,
        type,
        target: target ?? ListTarget.Trending,
        filterMap: $filterMap,
        baseFilters: appliedExtras,
        privacy,
      });

    if (!slug) {
      return;
    }

    goBack();
  };

  const isAtLimit = $derived(!list && limits.dynamicLists.current >= limit);
  const isSaving = $derived($isCreating || $isUpdating);
  const isDisabled = $derived(isAtLimit || isSaving);
  const canSave = $derived(
    !isDisabled && listName.trim().length > 0 && (!list || hasChanges),
  );
</script>

{#snippet privacyToggle()}
  <ListPrivacySwitch
    {privacy}
    hasLegacyState
    disabled={isDisabled}
    onChange={(next) => (privacy = next)}
  />
{/snippet}

{#snippet headerActions()}
  <Button
    size="small"
    variant="primary"
    color="purple"
    disabled={!canSave}
    label={list ? m.button_label_apply() : m.button_label_create_list()}
    onclick={onSaveHandler}
  >
    {list ? m.button_text_apply() : m.button_text_create()}
  </Button>
  <ActionButton
    onclick={requestClose}
    label={m.button_label_close()}
    style="ghost"
    --color-foreground-default="var(--color-text-secondary)"
  >
    <CloseIcon />
  </ActionButton>
{/snippet}

{#snippet targetSelector()}
  <FilterGroup>
    <Filter title={m.header_target()} variant="inline">
      <div class="trakt-target-row">
        <TargetDropdown
          value={target}
          onChange={(value) => (target = value)}
          disabled={isDisabled}
        />
        <MediaTypeToggler {type} onChange={(value) => (type = value)} />
      </div>
    </Filter>
  </FilterGroup>
{/snippet}

{#snippet genreSettings()}
  <SmartListMatchFilter
    value={extraFilters.genres_operator}
    disabled={isDisabled}
    onChange={(value) =>
      setExtraFilters(
        withSmartListFilter({
          filters: extraFilters,
          key: "genres_operator",
          value,
        }),
      )}
  />
{/snippet}

{#snippet moreFilters()}
  <SmartListMoreFilters
    filters={extraFilters}
    {type}
    disabled={isDisabled}
    onChange={setExtraFilters}
  />
{/snippet}

{#snippet recipe()}
  {#if target}
    <SmartListRecipe
      {target}
      {type}
      extraCount={Object.keys(appliedExtras).length}
    />
  {/if}
{/snippet}

<div class="trakt-smart-list-creator">
  {#if target}
    <TargetPreview
      {target}
      {type}
      filters={toSmartListFilters($filterMap, appliedExtras)}
    />
  {/if}

  <Drawer
    title={list ? m.header_edit_smart_list() : m.header_create_smart_list()}
    metaInfo={recipe}
    badge={privacyToggle}
    actions={$isMobile ? headerActions : undefined}
    onClose={requestClose}
    size="normal"
    dismissal="manual"
  >
    {#if isAtLimit}
      <LimitWarning />
    {/if}

    <Form
      onSubmit={onSaveHandler}
      onCancel={requestClose}
      disabled={!canSave}
      confirmButtonText={list ? m.button_text_apply() : m.button_text_create()}
      confirmButtonLabel={list
        ? m.button_label_apply()
        : m.button_label_create_list()}
      stickyActions
      hasActions={!$isMobile}
    >
      <div class="trakt-smart-list-form-content" class:is-limited={isAtLimit}>
        <FormInput
          placeholder={m.input_placeholder_lists_name()}
          onChange={(value) => (listName = value)}
          disabled={isDisabled}
          value={listName}
          autofocus
          required
          validation={{
            isValid: (value) => value.trim().length > 0,
            errorText: m.validation_text_list_name(),
          }}
        />

        <FilterTabs
          {activeMode}
          setActiveMode={onActiveModeChange}
          actions={targetSelector}
          advanced={moreFilters}
          {settingsFor}
          {hasExtraFilters}
          tabPosition={$isMobile ? "bottom" : "top"}
        />
      </div>
    </Form>
  </Drawer>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-creator {
    display: grid;
    grid-template-columns: 1fr var(--ni-380);

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
    }
  }

  .trakt-smart-list-form-content {
    --filters-content-gap: var(--gap-m);

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    &.is-limited {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .trakt-target-row {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    min-width: 0;
  }
</style>
