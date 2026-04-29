<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import type { NoteDrawerType } from "$lib/features/notes/models/NoteDrawerProps.ts";
  import { useAddNoteDrawer } from "$lib/features/notes/useAddNoteDrawer.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { Snippet } from "svelte";

  type NotePromptProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDismiss: () => void;
    title: string;
    type: MediaType;
    id: number;
    noteType: NoteDrawerType;
    children?: Snippet;
    customAnchor?: HTMLElement | Nil;
  };

  const {
    open,
    onOpenChange,
    onDismiss,
    title,
    type,
    id,
    noteType,
    children,
    customAnchor,
  }: NotePromptProps = $props();

  const { open: openNoteDrawer } = useAddNoteDrawer();

  const message = $derived.by(() => {
    if (noteType === "favorites") return m.text_info_favorites_added();

    return type === "movie"
      ? m.text_info_movie_dropped()
      : m.text_info_show_dropped();
  });

  const handleAddNote = () => {
    onDismiss();
    openNoteDrawer({ type: noteType, mediaType: type, title, id });
  };
</script>

<Snackbar
  {open}
  {onOpenChange}
  {onDismiss}
  onAction={handleAddNote}
  title={m.button_text_add_note()}
  {message}
  actionLabel={m.button_label_add_note({ title })}
  actionText={m.button_text_add_note()}
  {children}
  anchor={customAnchor}
/>
