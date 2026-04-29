<script lang="ts">
  import type { Snippet } from "svelte";
  import NotePrompt from "../_internal/NotePrompt.svelte";
  import { createDropNoteContext } from "./_internal/createDropNoteContext.ts";
  import type { DropNoteTarget } from "./_internal/DropNoteContext.ts";

  const { children }: { children: Snippet } = $props();

  let open = $state(false);
  let target = $state<DropNoteTarget | null>(null);

  createDropNoteContext({
    show: (value) => {
      target = value;
      open = true;
    },
  });

  const dismiss = () => {
    open = false;
  };

  let promptAnchor = $state<HTMLElement | Nil>(null);
</script>

<NotePrompt
  open={open && !!target}
  onOpenChange={(value) => {
    if (!value) {
      open = false;
      target = null;
    }
  }}
  onDismiss={dismiss}
  title={target?.title ?? ""}
  type={target?.type ?? "movie"}
  id={target?.id ?? 0}
  noteType="drop"
  customAnchor={promptAnchor}
/>

<div bind:this={promptAnchor}>
  {@render children()}
</div>
