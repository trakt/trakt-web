<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import NotesIcon from "$lib/components/icons/NotesIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";

  const {
    onClick,
    variant,
    style = "action",
    media,
  }: {
    onClick: () => void;
    variant?: "primary" | "secondary";
    style?: "action" | "dropdown-item";
    media: MediaEntry;
  } = $props();

  const { notes } = useUser();

  const hasNotes = $derived.by(() => {
    if (!$notes) return false;
    const map = media.type === "movie" ? $notes.movies : $notes.shows;
    return (map.get(media.id)?.length ?? 0) > 0;
  });
</script>

{#if style === "action"}
  <ActionButton style="ghost" label="Notes" {variant} onclick={onClick}>
    <NotesIcon active={hasNotes} />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem
    style="flat"
    color="default"
    variant={variant ?? "primary"}
    onclick={onClick}
  >
    Notes
    {#snippet icon()}
      <NotesIcon active={hasNotes} />
    {/snippet}
  </DropdownItem>
{/if}
