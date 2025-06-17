<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import type { Season } from "$lib/requests/models/Season";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";

  const { season, urlBuilder }: { season: Season; urlBuilder: () => string } =
    $props();
</script>

<PortraitCard>
  <Link focusable={false} href={urlBuilder()} noscroll>
    <CardCover
      title={seasonLabel(season.number)}
      src={season.poster.url.medium}
      alt="{seasonLabel(season.number)}}"
    />
  </Link>
  <CardFooter>
    <p use:lineClamp={{ lines: 2 }} class="trakt-card-title trakt-video-title">
      {seasonLabel(season.number)}
    </p>
  </CardFooter>
</PortraitCard>

<style>
  .trakt-video-title {
    line-height: var(--ni-16);
  }
</style>
