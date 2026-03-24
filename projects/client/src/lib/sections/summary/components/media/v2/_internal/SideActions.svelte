<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import NotesDrawer from "../../../notes/NotesDrawer.svelte";
  import DetailsButton from "./DetailsButton.svelte";
  import NotesButton from "./NotesButton.svelte";

  const {
    title,
    type,
    variant,
    style = "action",
    media,
  }: {
    title: string;
    type: MediaType;
    variant?: "primary" | "secondary";
    style?: "action" | "dropdown-item";
    media: MediaEntry;
  } = $props();

  let showNotesDrawer = $state(false);
</script>

<ShareButton
  {title}
  {style}
  {variant}
  textFactory={({ title }) => {
    switch (type) {
      case "movie":
        return m.text_share_movie({ title });
      case "show":
        return m.text_share_show({ title });
    }
  }}
  source={{ id: "media", type }}
/>

<NotesButton
  {style}
  {variant}
  onClick={() => (showNotesDrawer = true)}
  {media}
/>

<DetailsButton {style} {variant} {title} />

{#if showNotesDrawer}
  <NotesDrawer onClose={() => (showNotesDrawer = false)} {media} />
{/if}
