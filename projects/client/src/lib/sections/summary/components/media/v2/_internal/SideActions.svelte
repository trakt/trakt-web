<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";

  const {
    title,
    type,
    variant,
    style = "action",
  }: {
    title: string;
    type: MediaType;
    variant?: "primary" | "secondary";
    style?: "action" | "dropdown-item";
  } = $props();
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
