<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const {
    type,
    media,
  }: { type: "movie" | "show"; media: MovieEntry | ShowEntry } = $props();
</script>

<Link focusable={false} href={UrlBuilder.media(type, media.slug)}>
  <CardCover
    title={media.title}
    src={media.cover.url.thumb}
    alt={m.image_alt_media_poster({ title: media.title })}
  />
</Link>
