<script lang="ts">
  import { m } from "$lib/features/i18n/messages";
  import TextCard from "../../_internal/TextCard.svelte";
</script>

<TextCard --width-card="100%" --height-card="fit-content">
  {#snippet header()}
    <p class="bold">{m.header_notes_placeholder()}</p>
  {/snippet}

  <p>{m.notes_placeholder_text()}</p>
</TextCard>
