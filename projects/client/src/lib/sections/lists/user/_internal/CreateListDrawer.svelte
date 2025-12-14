<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { useCreateList } from "./useCreateList";

  const { onClose }: { onClose: () => void } = $props();

  const isOpen = writable(true);

  const name = writable("");
  const description = writable("");
  const isPrivate = writable(false);

  const { createList, isCreating } = useCreateList();

  async function handleSubmit() {
    await createList({
      name: $name,
      description: $description,
      privacy: $isPrivate ? "private" : "public",
    });

    $isOpen && onClose();
  }
</script>

<Drawer
  onClose={() => {
    isOpen.set(false);
    onClose();
  }}
  size="auto"
  title={m.page_title_create_list()}
  classList="trakt-create-list-drawer"
>
  {#snippet badge()}
    <div class="trakt-list-privacy-toggle">
      <span class="secondary">{m.text_private()}</span>
      <Switch
        label={m.switch_label_toggle_list_privacy()}
        checked={$isPrivate}
        onclick={() => isPrivate.set(!$isPrivate)}
      />
    </div>
  {/snippet}

  <Form
    onSubmit={handleSubmit}
    onCancel={onClose}
    disabled={$isCreating}
    confirmButtonText={m.button_text_create()}
    confirmButtonLabel={m.button_label_create_list()}
  >
    <div class="trakt-list-properties">
      <FormInput
        placeholder={m.input_placeholder_lists_name()}
        onChange={(value) => name.set(value.trim())}
        disabled={$isCreating}
        value={$name}
        autofocus
        validation={{
          isValid: (value) => value.trim().length > 0,
          errorText: m.validation_text_list_name(),
        }}
      />
      <FormInput
        placeholder={m.input_placeholder_lists_description()}
        onChange={description.set}
        disabled={$isCreating}
        value={$description}
      />
    </div>
  </Form>
</Drawer>

<style>
  :global(.trakt-create-list-drawer) {
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
