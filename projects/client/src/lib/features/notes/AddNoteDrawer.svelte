<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserNote } from "$lib/requests/models/UserNote.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { getNoteValidation } from "./_internal/getNoteValidation";
  import { mapToNoteType } from "./_internal/mapToNoteType";
  import { useEditNote } from "./_internal/useEditNote";
  import { usePostNote } from "./_internal/usePostNote";
  import type { NoteDrawerProps } from "./models/NoteDrawerProps";

  type PostMode = {
    mode?: "post";
  };

  type EditMode = {
    mode: "edit";
    note: UserNote;
  };

  type AddNoteDrawerProps = NoteDrawerProps & {
    onClose: () => void;
  } & (PostMode | EditMode);

  const { type, onClose, title, id, mediaType, ...rest }: AddNoteDrawerProps =
    $props();

  const isEditing = $derived(rest.mode === "edit");

  const initialNotes = iffy(() =>
    rest.mode === "edit" ? rest.note.notes : "",
  );

  let notes = $state(initialNotes);
  let hasUnexpectedError = $state(false);

  const { postNote, isPosting } = usePostNote();
  const { editNote, isEditing: isEditingNote } = useEditNote();

  const isBusy = $derived($isPosting || $isEditingNote);

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

    const params = {
      notes,
      type: mapToNoteType(type),
      media: { type: mediaType, id },
    };

    const result =
      rest.mode === "edit"
        ? await editNote({ ...params, id: rest.note.id })
        : await postNote(params);

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
    disabled={notes.trim().length === 0 || isBusy}
    confirmButtonText={isEditing
      ? m.button_text_edit_note()
      : m.button_text_add_note()}
    confirmButtonLabel={isEditing
      ? m.button_label_edit_note({ title })
      : m.button_label_add_note({ title })}
  >
    <div class="trakt-note-properties">
      <FormTextArea
        {placeholder}
        value={initialNotes}
        onChange={(value) => (notes = value)}
        disabled={isBusy}
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
