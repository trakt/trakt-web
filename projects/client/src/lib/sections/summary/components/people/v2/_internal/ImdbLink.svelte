<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { imdbId }: { imdbId: string } = $props();
  const { track } = useTrack(AnalyticsEvent.Link);
</script>

<div class="trakt-person-imdb-link">
  <Link
    href={UrlBuilder.external.imdb.person(imdbId)}
    target="_blank"
    onclick={() => track({ target: "imdb", source: "person-summary" })}
  >
    <IMDBIcon />
  </Link>
</div>

<style>
  .trakt-person-imdb-link {
    :global(svg) {
      height: var(--ni-32);
      width: auto;
    }
  }
</style>
