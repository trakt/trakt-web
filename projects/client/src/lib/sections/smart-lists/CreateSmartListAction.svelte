<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/buttons/Button.svelte";
  import DrawerDock from "$lib/components/drawer/DrawerDock.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import SmartListIcon from "$lib/components/icons/SmartListIcon.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { ListTarget } from "./models/ListTarget";
  import { useCreateSmartList } from "./useCreateSmartList";

  const { target }: { target: ListTarget } = $props();

  const { createList, isCreating } = useCreateSmartList();
  const { filterMap } = useFilter();
  const { mode } = useDiscover();
  const { notify } = useActionToast();

  let isNaming = $state(false);
  let listName = $state("");
  let fieldElement = $state<HTMLElement | undefined>();

  const startNaming = () => {
    isNaming = true;

    requestAnimationFrame(() => {
      fieldElement?.querySelector("input")?.focus({ preventScroll: true });
    });
  };

  const reset = () => {
    isNaming = false;
    listName = "";
  };

  const onSubmit = async () => {
    const name = listName;

    if (!name.trim()) {
      return;
    }

    const slug = await createList({
      name,
      type: $mode,
      target,
      filterMap: $filterMap,
    });

    if (!slug) {
      return;
    }

    reset();

    notify({
      message: m.action_toast_created_smart_list({ title: name }),
      action: {
        text: m.action_toast_action_view_smart_list(),
        label: m.action_toast_label_view_smart_list(),
        onAction: () => goto(UrlBuilder.lists.smart.view(slug)),
      },
    });
  };
</script>

{#snippet smartListIcon()}
  <SmartListIcon />
{/snippet}

<DrawerDock>
  <form
    class="trakt-create-smart-list"
    class:is-naming={isNaming}
    onsubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <div class="name-field" bind:this={fieldElement} inert={!isNaming}>
      <div class="name-field-content">
        <FormInput
          placeholder={m.input_placeholder_lists_name()}
          onChange={(value) => (listName = value)}
          disabled={$isCreating}
          value={listName}
          required
          validation={{
            isValid: (value) => value.trim().length > 0,
            errorText: m.validation_text_list_name(),
          }}
        />
      </div>
    </div>

    <div class="dock-actions">
      {#if isNaming}
        <Button
          size="small"
          variant="secondary"
          color="default"
          type="button"
          disabled={$isCreating}
          label={m.button_label_cancel()}
          onclick={reset}
        >
          {m.button_text_cancel()}
        </Button>

        <Button
          size="small"
          variant="primary"
          color="purple"
          type="submit"
          disabled={$isCreating || !listName.trim()}
          label={m.button_label_create_list()}
        >
          {m.button_text_create()}
        </Button>
      {:else}
        <Button
          size="small"
          variant="primary"
          color="purple"
          type="button"
          label={m.button_label_create_list()}
          icon={smartListIcon}
          onclick={startNaming}
        >
          {m.header_create_smart_list()}
        </Button>
      {/if}
    </div>
  </form>
</DrawerDock>

<style lang="scss">
  .trakt-create-smart-list {
    display: flex;
    flex-direction: column;

    width: 100%;
    min-width: 0;

    .name-field {
      display: grid;
      grid-template-rows: 0fr;

      opacity: 0;
      padding-block-end: 0;

      transition: var(--transition-increment) ease-in-out;
      transition-property: grid-template-rows, opacity, padding-block-end;
    }

    .name-field-content {
      overflow: hidden;
      min-height: 0;
    }

    &.is-naming .name-field {
      grid-template-rows: 1fr;
      opacity: 1;
      padding-block-end: var(--gap-xs);
    }

    .dock-actions {
      display: flex;
      gap: var(--gap-xs);
    }

    @media (prefers-reduced-motion: reduce) {
      .name-field {
        transition: none;
      }
    }
  }
</style>
