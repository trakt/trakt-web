<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { useQuery } from "$lib/features/query/useQuery";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  const { id, type }: { id: number; type: "movie" | "show" } = $props();

  // Trakt's id-extractor accepts a numeric trakt id as the `slug` param, so we
  // can hydrate by id without first looking up a slug.
  const slugParam = $derived(id.toString());

  const query = $derived(
    type === "movie"
      ? useQuery(movieSummaryQuery({ slug: slugParam }))
      : useQuery(showSummaryQuery({ slug: slugParam })),
  );

  const media = $derived(query.pipe(map(($q) => $q.data)));
</script>

<div class="trakt-shared-media-poster">
  {#if $media}
    <Link href={UrlBuilder.media(type, $media.slug)} color="inherit">
      <img
        src={$media.poster.url.medium}
        alt={$media.title}
        loading="lazy"
        decoding="async"
      />
      <span class="title ellipsis bold small">{$media.title}</span>
    </Link>
  {:else}
    <div class="placeholder"></div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-shared-media-poster {
    min-width: 0;

    :global(a) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
      text-decoration: none;
    }

    img {
      width: 100%;
      aspect-ratio: 2 / 3;
      border-radius: var(--border-radius-s, var(--ni-8));
      object-fit: cover;
      background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
      transition: transform 200ms ease-out;
    }

    @include for-mouse {
      :global(a:hover img) {
        transform: translateY(-2px);
      }
    }
  }

  .title {
    line-height: 1.2;
  }

  .placeholder {
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-s, var(--ni-8));
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
  }
</style>
