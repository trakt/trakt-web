<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { getDeepLinkHandler } from "$lib/features/deep-link/getDeepLinkHandler";
  import type { Season } from "$lib/requests/models/Season";

  const { season, urlBuilder }: { season: Season; urlBuilder: () => string } =
    $props();
  const deepLinkHandler = getDeepLinkHandler();
</script>

<PortraitCard>
  <Link focusable={false} href={urlBuilder()} noscroll>
    <CardCover
      title={m.season_number_label({ number: season.number })}
      src={season.poster.url.medium}
      alt="{m.season_number_label({ number: season.number })}}"
      style="flat"
    />
  </Link>
  <CardFooter>
    <p use:lineClamp={{ lines: 2 }} class="trakt-card-title trakt-video-title">
      {m.season_number_label({ number: season.number })}
    </p>
  </CardFooter>
</PortraitCard>

<style>
  .trakt-video-title {
    line-height: var(--ni-16);
  }
</style>
