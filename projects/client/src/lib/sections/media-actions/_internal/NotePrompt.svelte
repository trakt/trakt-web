<script lang="ts">
  import AutoCloseButton from "$lib/components/buttons/AutoCloseButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import type { NoteDrawerType } from "$lib/features/notes/models/NoteDrawerProps.ts";
  import { useAddNoteDrawer } from "$lib/features/notes/useAddNoteDrawer.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
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

{#snippet popoverContent()}
  <div class="trakt-note-prompt-popover" role="status" aria-live="polite">
    <div class="trakt-note-prompt-popover-header">
      <span class="bold title">{title}</span>
      <AutoCloseButton onclick={onDismiss} label={m.button_label_close()} />
    </div>
    <p>{message}</p>
    <div class="trakt-note-prompt-popover-actions">
      <Button
        size="small"
        color="default"
        label={m.button_label_cancel()}
        onclick={onDismiss}
      >
        {m.button_text_cancel()}
      </Button>
      <Button
        size="small"
        variant="primary"
        color="purple"
        label={m.button_label_add_note({ title })}
        onclick={handleAddNote}
      >
        {m.button_text_add_note()}
      </Button>
    </div>
  </div>
{/snippet}

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <Snackbar
    {open}
    {onDismiss}
    {message}
    action={{
      text: m.button_text_add_note(),
      label: m.button_label_add_note({ title }),
      onAction: handleAddNote,
    }}
  />
  {@render children?.()}
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  {#if customAnchor}
    <Popover {open} {onOpenChange} {customAnchor} content={popoverContent} />
  {:else}
    <Popover {open} {onOpenChange} content={popoverContent}>
      {@render children?.()}
    </Popover>
  {/if}
</RenderFor>

<style>
  .trakt-note-prompt-popover {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    min-width: var(--ni-240);
    padding: var(--ni-16);

    background-color: var(--color-modal-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-menu);

    animation: fade-in var(--transition-increment) ease-out forwards;
  }

  .trakt-note-prompt-popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-8);
  }

  .trakt-note-prompt-popover-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ni-8);
  }
</style>
