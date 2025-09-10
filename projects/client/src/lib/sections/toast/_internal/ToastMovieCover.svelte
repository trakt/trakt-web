<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { movie }: { movie: MovieEntry } = $props();
</script>

<Link focusable={false} href={UrlBuilder.media("movie", movie.slug)}>
  <CardCover
    title={movie.title}
    src={movie.cover.url.thumb}
    alt={m.image_alt_media_poster({ title: movie.title })}
  />
</Link>
