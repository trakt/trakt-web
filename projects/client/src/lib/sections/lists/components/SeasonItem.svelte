<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import type { Season } from "$lib/requests/models/Season";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";

  const SCROLL_OFFSET = 8;

  const {
    season,
    urlBuilder,
    isCurrentSeason,
  }: { season: Season; urlBuilder: () => string; isCurrentSeason: boolean } =
    $props();

  const scrollToItem = (element: HTMLElement) => {
    if (!isCurrentSeason) return;

    const parent = element.parentElement;
    if (!parent) {
      return;
    }

    const parentRight = parent.scrollLeft + parent.clientWidth;
    const elementLeft = element.offsetLeft;
    const elementRight = elementLeft + element.offsetWidth;
    const isOutOfView = elementRight > parentRight;

    if (!isOutOfView) {
      return;
    }

    requestAnimationFrame(() => {
      parent.scrollTo({
        left: elementLeft - SCROLL_OFFSET,
        behavior: "instant",
      });
    });
  };
</script>

<div
  class="trakt-season-item"
  class:is-current-season={isCurrentSeason}
  use:scrollToItem
>
  <PortraitCard>
    <Link focusable={false} href={urlBuilder()} noscroll>
      <CardCover
        title={seasonLabel(season.number)}
        src={season.poster.url.medium}
        alt={seasonLabel(season.number)}
      />
    </Link>
    <CardFooter>
      <p
        use:lineClamp={{ lines: 2 }}
        class="trakt-season-title"
        class:trakt-card-title={isCurrentSeason}
        class:trakt-card-subtitle={!isCurrentSeason}
      >
        {seasonLabel(season.number)}
      </p>
    </CardFooter>
  </PortraitCard>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-season-title {
    line-height: var(--ni-16);
  }

  .trakt-season-item {
    -webkit-tap-highlight-color: transparent;

    cursor: pointer;
    transition: opacity var(--transition-increment) ease-in-out;

    &:not(.is-current-season) {
      opacity: var(--de-emphasized-opacity);

      @include for-mouse() {
        &:hover {
          opacity: 1;
        }
      }
    }
  }
</style>
