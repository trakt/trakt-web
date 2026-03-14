<script lang="ts">
  import type { UserNote } from "$lib/requests/models/UserNote";
  import TextCard from "../../_internal/TextCard.svelte";
  import NoteHeader from "./NoteHeader.svelte";

  const { note }: { note: UserNote } = $props();
</script>

<TextCard --width-card="100%" --height-card="fit-content">
  {#snippet header()}
    <NoteHeader {note} />
  {/snippet}

  <div class="trakt-user-note-content">
    <p>
      {note.notes}
    </p>
  </div>
</TextCard>
