<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";

  const {
    title,
    type,
    style = "action",
  }: {
    title: string;
    type: MediaType;
    style?: "action" | "dropdown-item";
  } = $props();
</script>

<div class="trakt-summary-side-actions">
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
</div>

<style>
  .trakt-summary-side-actions {
    width: var(--summary-side-action-bar-width);
  }
</style>
