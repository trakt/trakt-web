<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import TrailerButton from "./TrailerButton.svelte";

  const {
    title,
    type,
    trailer,
    style = "action",
    slug,
  }: {
    title: string;
    type: MediaType;
    trailer: string;
    style?: "action" | "dropdown-item";
    slug: string;
  } = $props();
</script>

<ShareButton
  {title}
  {style}
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

<TrailerButton {trailer} {style} {slug} />
