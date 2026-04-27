<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { show }: { show: ShowEntry } = $props();
</script>

<Link focusable={false} href={UrlBuilder.media("show", show.slug)}>
  <CardCover
    title={show.title}
    src={show.cover.url.thumb}
    alt={m.image_alt_media_poster({ title: show.title })}
  />
</Link>
