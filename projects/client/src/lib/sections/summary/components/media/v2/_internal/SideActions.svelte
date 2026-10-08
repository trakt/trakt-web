<script lang="ts">
  import { page } from "$app/state";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { openGraphUrlBuilder } from "$lib/sections/layout/_internal/openGraphUrlBuilder";
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

  const image = $derived(
    openGraphUrlBuilder({
      url: page.url,
      type,
      slug: page.params.slug ?? media.slug,
    }),
  );
</script>

<ShareButton
  {title}
  {image}
  {style}
  {variant}
  source={{ id: "media", type }}
/>

<NotesButton {style} {variant} {media} />
