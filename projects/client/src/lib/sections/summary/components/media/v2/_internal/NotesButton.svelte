<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import NotesIcon from "$lib/components/icons/NotesIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation.ts";

  const {
    variant,
    style = "action",
    media,
  }: {
    variant?: "primary" | "secondary";
    style?: "action" | "dropdown-item";
    media: MediaEntry;
  } = $props();

  const { notes } = useUser();
  const { buildDrawerLink } = summaryDrawerNavigation();

  const hasNotes = $derived.by(() => {
    if (!$notes) return false;
    const map = media.type === "movie" ? $notes.movies : $notes.shows;
    return (map.get(media.id)?.length ?? 0) > 0;
  });

  const drawerLink = $derived(buildDrawerLink(SummaryDrawers.Notes));
</script>

{#if hasNotes}
  {#if style === "action"}
    <ActionButton style="ghost" label="Notes" {variant} {...drawerLink}>
      <NotesIcon active={hasNotes} />
    </ActionButton>
  {/if}

  {#if style === "dropdown-item"}
    <DropdownItem
      style="flat"
      color="default"
      variant={variant ?? "primary"}
      {...drawerLink}
    >
      Notes
      {#snippet icon()}
        <NotesIcon active={hasNotes} />
      {/snippet}
    </DropdownItem>
  {/if}
{/if}
