<script lang="ts">
  import { goto } from "$app/navigation";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import type { UserLimits } from "$lib/requests/models/UserLimits";
  import { iffy } from "$lib/utils/function/iffy";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { untrack } from "svelte";
  import FilterSection from "../navbar/components/filter/FilterSection.svelte";
  import FilterTabs from "../navbar/components/filter/FilterTabs.svelte";
  import LimitWarning from "./_internal/LimitWarning.svelte";
  import MediaTypeToggler from "./_internal/MediaTypeToggler.svelte";
  import TargetDropdown from "./_internal/TargetDropdown.svelte";
  import TargetPreview from "./_internal/TargetPreview.svelte";
  import SmartListRecipe from "./_internal/SmartListRecipe.svelte";
  import { toSmartListFilterMode } from "./toSmartListFilterMode";
  import { ListTarget } from "./models/ListTarget";
  import { toDiscoverMode } from "../lists/smart/_internal/toDiscoverMode";
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

  const limit = iffy(() =>
    $user.isVip ? limits.dynamicLists.vip : limits.dynamicLists.free,
  );

  const toTarget = (source: SmartList["source"]) =>
    Object.values(ListTarget).find((value) => value === source);

  const initial = untrack(() => ({
    name: list?.title ?? "",
    type: list ? toDiscoverMode(list.mediaType) : mode,
    target: list ? toTarget(list.source) : ListTarget.Trending,
    filterMode: list
      ? toSmartListFilterMode(list.filters)
      : FilterMode.Simple,
  }));

  let listName = $state(initial.name);
  let type = $state<DiscoverMode>(initial.type);
  let activeMode = $state(initial.filterMode);
  let target = $state<ListTarget | undefined>(initial.target);

  const goBack = () => {
    goto(
      list
        ? UrlBuilder.lists.smart.view(list.slug)
        : UrlBuilder.lists.user("me"),
    );
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
        baseFilters: list.filters,
      })
      : await createList({
        name: listName,
        type,
        target: target ?? ListTarget.Trending,
        filterMap: $filterMap,
      });

    if (!slug) {
      return;
    }

    goBack();
  };

  const isAtLimit = $derived(!list && limits.dynamicLists.current >= limit);
  const isSaving = $derived($isCreating || $isUpdating);
  const isDisabled = $derived(isAtLimit || isSaving);
</script>

{#snippet targetSelector()}
  <FilterSection title={m.header_target()} variant="inline">
    <div class="trakt-target-row">
      <TargetDropdown
        value={target}
        onChange={(value) => (target = value)}
        disabled={isDisabled}
      />
      <MediaTypeToggler {type} onChange={(value) => (type = value)} />
    </div>
  </FilterSection>
{/snippet}

{#snippet recipe()}
  {#if target}
    <SmartListRecipe {target} {type} />
  {/if}
{/snippet}

<div class="trakt-smart-list-creator">
  {#if target}
    <TargetPreview {target} {type} />
  {/if}

  <Drawer
    title={list ? m.header_edit_smart_list() : m.header_create_smart_list()}
    metaInfo={recipe}
    onClose={goBack}
    size="normal"
    dismissal="manual"
  >
    {#if isAtLimit}
      <LimitWarning />
    {/if}

    <Form
      onSubmit={onSaveHandler}
      onCancel={goBack}
      disabled={isDisabled || !listName}
      confirmButtonText={list ? m.button_text_apply() : m.button_text_create()}
      confirmButtonLabel={list
        ? m.button_label_apply()
        : m.button_label_create_list()}
      stickyActions
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
    justify-content: flex-end;
    gap: var(--gap-xs);

    min-width: 0;
  }
</style>
