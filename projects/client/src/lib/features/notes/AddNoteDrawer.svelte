<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { getNoteValidation } from "./_internal/getNoteValidation";
  import { mapToNoteType } from "./_internal/mapToNoteType";
  import { usePostNote } from "./_internal/usePostNote";
  import type { NoteDrawerProps } from "./models/NoteDrawerProps";

  type AddNoteDrawerProps = NoteDrawerProps & {
    onClose: () => void;
  };

  const { type, onClose, title, id, mediaType }: AddNoteDrawerProps = $props();

  let notes = $state("");
  let hasUnexpectedError = $state(false);

  const { postNote, isPosting } = usePostNote();

  const placeholder = $derived.by(() => {
    switch (type) {
      case "favorites":
        return m.input_placeholder_note_favorite();
      case "drop":
        return m.input_placeholder_note_drop();
    }
  });

  const validation = $derived(getNoteValidation(notes));

  const handleSubmit = async () => {
    hasUnexpectedError = false;

    const result = await postNote({
      notes,
      type: mapToNoteType(type),
      media: { type: mediaType, id },
    });

    if (!result) {
      hasUnexpectedError = true;
      return;
    }

    onClose();
  };
</script>

<Drawer
  {onClose}
  title={m.drawer_title_add_note()}
  size="auto"
  metaInfo={title}
>
  <Form
    onSubmit={handleSubmit}
    onCancel={onClose}
    disabled={notes.trim().length === 0 || $isPosting}
    confirmButtonText={m.button_text_add_note()}
    confirmButtonLabel={m.button_label_add_note({ title })}
  >
    <div class="trakt-note-properties">
      <FormTextArea
        {placeholder}
        onChange={(value) => (notes = value)}
        disabled={$isPosting}
        autofocus
        {validation}
      />

      {#if hasUnexpectedError}
        <DismissibleError
          message={m.error_text_unexpected_notes_error()}
          href={UrlBuilder.github.reportIssue()}
          onDismiss={() => (hasUnexpectedError = false)}
        />
      {/if}
    </div>
  </Form>
</Drawer>

<style>
  .trakt-note-properties {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
