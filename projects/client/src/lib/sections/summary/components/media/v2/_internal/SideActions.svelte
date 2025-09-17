<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";

  const {
    title,
    type,
    trailer,
  }: { title: string; type: MediaType; trailer: string } = $props();
</script>

<ShareButton
  {title}
  style="ghost"
  textFactory={({ title }) => {
    switch (type) {
      case "movie":
        return m.text_share_movie({ title });
      case "show":
        return m.text_share_show({ title });
    }
  }}
/>

<ActionButton
  style="ghost"
  href={trailer}
  label={m.translated_value_video_type_trailer()}
>
  <YouTubeIcon />
</ActionButton>
