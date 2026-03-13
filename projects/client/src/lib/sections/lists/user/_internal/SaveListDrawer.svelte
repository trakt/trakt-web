<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListPrivacy } from "$lib/requests/models/ListPrivacy";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { iffy } from "$lib/utils/function/iffy";

  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { useSaveList } from "./useSaveList";

  // FIXME: remove when we properly deal with other privacy options
  const SUPPORTED_PRIVACY: ListPrivacy[] = ["public", "private"];

  type CreateListProps = {
    type: "create";
  };

  type UpdateListProps = {
    type: "update";
    list: MediaListSummary;
  };

  type SaveListDrawerProps = {
    onClose: () => void;
  } & (CreateListProps | UpdateListProps);

  const { onClose, ...props }: SaveListDrawerProps = $props();

  const isOpen = writable(true);

  const defaultValues = iffy(() => {
    if (props.type === "create") {
      return {
        name: "",
        description: "",
        privacy: "public" as const,
      };
    }

    return {
      name: props.list.name,
      description: props.list.description,
      privacy: props.list.privacy,
    };
  });

  const name = writable(defaultValues.name);
  const description = writable(defaultValues.description);
  const privacy = writable(defaultValues.privacy);

  const { saveList, isSaving } = iffy(() =>
    props.type === "create"
      ? useSaveList({ type: "create" })
      : useSaveList({ type: "update", listId: props.list.slug }),
  );

  async function handleSubmit() {
    await saveList({
      name: $name,
      description: $description,
      privacy: $privacy,
    });

    $isOpen && onClose();
  }

  const isDirty = $derived(
    defaultValues.description !== $description ||
      defaultValues.name !== $name ||
      defaultValues.privacy !== $privacy,
  );
</script>

<Drawer
  onClose={() => {
    isOpen.set(false);
    onClose();
  }}
  size="auto"
  title={props.type === "create"
    ? m.page_title_create_list()
    : m.page_title_edit_list()}
  classList="trakt-save-list-drawer"
>
  {#snippet badge()}
    <div class="trakt-list-privacy-toggle">
      <span class="secondary">{m.text_private()}</span>
      <Switch
        label={m.switch_label_toggle_list_privacy()}
        checked={$privacy === "private"}
        indeterminate={!SUPPORTED_PRIVACY.includes($privacy)}
        onclick={() => {
          privacy.set($privacy === "private" ? "public" : "private");
        }}
      />
    </div>
  {/snippet}

  <Form
    onSubmit={handleSubmit}
    onCancel={onClose}
    disabled={$isSaving || !isDirty}
    isCancelDisabled={$isSaving}
    confirmButtonText={props.type === "create"
      ? m.button_text_create()
      : m.button_text_apply()}
    confirmButtonLabel={props.type === "create"
      ? m.button_label_create_list()
      : m.button_label_apply()}
  >
    <div class="trakt-list-properties">
      <FormInput
        placeholder={m.input_placeholder_lists_name()}
        onChange={(value) => name.set(value.trim())}
        disabled={$isSaving}
        value={$name}
        autofocus
        required
        validation={{
          isValid: (value) => value.trim().length > 0,
          errorText: m.validation_text_list_name(),
        }}
      />
      <FormInput
        placeholder={m.input_placeholder_lists_description()}
        onChange={description.set}
        disabled={$isSaving}
        value={$description}
      />
    </div>
  </Form>
</Drawer>

<style>
  :global(.trakt-save-list-drawer) {
    :global(.trakt-drawer-title-container) {
      flex-grow: 1;
      justify-content: space-between;
    }
  }

  .trakt-list-properties {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-list-privacy-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    gap: var(--gap-xs);
  }
</style>
