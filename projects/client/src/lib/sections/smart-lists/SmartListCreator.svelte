<script lang="ts">
  import { goto } from "$app/navigation";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { UserLimits } from "$lib/requests/models/UserLimits";
  import { iffy } from "$lib/utils/function/iffy";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import FilterTabs from "../navbar/components/filter/FilterTabs.svelte";
  import LimitWarning from "./_internal/LimitWarning.svelte";
  import MediaTypeToggler from "./_internal/MediaTypeToggler.svelte";
  import TargetDropdown from "./_internal/TargetDropdown.svelte";
  import TargetPreview from "./_internal/TargetPreview.svelte";
  import { ListTarget } from "./models/ListTarget";
  import { useCreateSmartList } from "./useCreateSmartList";

  const { mode, limits }: { mode: DiscoverMode; limits: UserLimits } = $props();

  const { createList, isCreating } = useCreateSmartList();
  const { filterMap } = useFilter();
  const { user } = useUser();

  const limit = iffy(() =>
    $user.isVip ? limits.dynamicLists.vip : limits.dynamicLists.free,
  );

  let listName = $state("");
  let type = $state<MediaType>(iffy(() => (mode === "media" ? "show" : mode)));
  let activeMode = $state(FilterMode.Simple);
  let target = $state<ListTarget>(ListTarget.Trending);

  const goBack = () => {
    goto(UrlBuilder.lists.user("me"));
  };

  const onActiveModeChange = (to: string) => {
    activeMode = to as FilterMode;
  };

  const onCreateHandler = async () => {
    await createList({
      name: listName,
      type,
      target,
      filterMap: $filterMap,
    });

    goBack();
  };

  const isAtLimit = $derived(limits.dynamicLists.current >= limit);
  const isDisabled = $derived(isAtLimit || $isCreating);
</script>

{#snippet targetSelector()}
  <div class="trakt-target-selector-container">
    <span>{m.header_target()}</span>
    <div class="trakt-target-selector">
      <TargetDropdown
        value={target}
        onChange={(value) => (target = value)}
        disabled={isDisabled}
      />
      <MediaTypeToggler {type} onChange={(value) => (type = value)} />
    </div>
  </div>
{/snippet}

<div class="trakt-smart-list-creator">
  <TargetPreview {target} {type} />

  <Drawer
    title={m.header_create_smart_list()}
    onClose={goBack}
    size="normal"
    hasAutoClose={false}
  >
    {#if isAtLimit}
      <LimitWarning />
    {/if}

    <Form
      onSubmit={onCreateHandler}
      onCancel={goBack}
      disabled={isDisabled || !listName}
      confirmButtonText={m.button_text_create()}
      confirmButtonLabel={m.button_label_create_list()}
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
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    &.is-limited {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .trakt-target-selector-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-target-selector {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--gap-xxs);
  }
</style>
