<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
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
</script>

<ShareButton
  {title}
  {style}
  {variant}
  source={{ id: "media", type }}
/>

<NotesButton {style} {variant} {media} />
