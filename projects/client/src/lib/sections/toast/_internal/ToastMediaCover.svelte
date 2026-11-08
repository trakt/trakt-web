<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ToastCover from "./ToastCover.svelte";

  const {
    type,
    media,
  }: { type: "movie" | "show"; media: MovieEntry | ShowEntry } = $props();
</script>

<ToastCover
  href={UrlBuilder.media(type, media.slug)}
  src={media.cover.url.thumb}
  title={media.title}
  alt={m.image_alt_media_poster({ title: media.title })}
/>
