<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import TrailerButton from "./TrailerButton.svelte";

  const {
    title,
    type,
    style = "action",
    slug,
    trailer,
  }: {
    title: string;
    slug: string;
    trailer: string;
    type: MediaType;
    style?: "action" | "dropdown-item";
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

<RenderFor audience="public">
  <TrailerButton {slug} {trailer} style="action" />
</RenderFor>
