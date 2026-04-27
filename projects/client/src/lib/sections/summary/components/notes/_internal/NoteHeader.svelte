<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { m } from "$lib/features/i18n/messages";
  import type { UserNote } from "$lib/requests/models/UserNote";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import type { Snippet } from "svelte";
  import TextCardHeader from "../../_internal/TextCardHeader.svelte";
  import NoteIcon from "./NoteIcon.svelte";

  const { note, actions }: { note: UserNote; actions?: Snippet } = $props();
</script>

<TextCardHeader
  subTitle={toHumanDay({ date: note.updatedAt, locale: getLocale() })}
  {actions}
>
  {#snippet icon()}
    <NoteIcon {note} />
  {/snippet}

  {#if note.type === "favorites"}
    <p class="secondary bold ellipsis">{m.list_title_favorites()}</p>
  {/if}

  {#if note.type === "note"}
    <p class="secondary bold ellipsis">{m.text_personal_note()}</p>
  {/if}
</TextCardHeader>
