<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    shows,
    movies,
    year,
  }: {
    id: string;
    index: number;
    shows: ReadonlyArray<MediaEntry>;
    movies: ReadonlyArray<MediaEntry>;
    year: number;
  } = $props();

  const posters = $derived([...shows.slice(0, 3), ...movies.slice(0, 3)]);
</script>

<YirScene {id} {index} kicker={m.yir_2024_thanks_intro()} title={m.yir_2024_thanks_title()}>
  {#snippet children()}
    <div class="yir-thanks-copy" data-reveal style:--d="calc(var(--yir-beat) * 2)">
      <p>
        <MessageWithBold
          message={m.yir_2024_thanks_copy_directed({ year, nextYear: year + 1 })}
        />
      </p>
      <p>{m.yir_2024_thanks_copy_recommend()}</p>
    </div>

    <ul class="yir-thanks-posters">
      {#each posters as entry, position (entry.key)}
        <li data-reveal style:--d="calc(var(--yir-beat) * {position} * 0.8)" style:--i={position}>
          <Link href={UrlBuilder.media(entry.type, entry.slug)} color="inherit">
            <CrossOriginImage src={entry.poster.url.medium} alt={entry.title} />
          </Link>
        </li>
      {/each}
    </ul>
  {/snippet}
</YirScene>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-thanks-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    max-width: 52ch;
    font-size: var(--font-size-title);
    color: var(--color-yir-text-secondary);

    p {
      margin: 0;
    }

    :global(b) {
      color: var(--color-yir-text-accent);
    }
  }

  .yir-thanks-posters {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-16);
    margin: 0;
    padding: 0;
    list-style: none;

    @include for-tablet-lg {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }

    @include for-desktop {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }

    li {
      animation: bob 5s ease-in-out infinite alternate;
      animation-delay: calc(var(--i) * -0.8s);
    }

    :global(img) {
      display: block;
      width: 100%;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: var(--border-radius-s);
      box-shadow: 0 var(--ni-16) var(--ni-32)
        color-mix(in srgb, var(--color-shadow) 35%, transparent);
    }
  }

  @keyframes bob {
    from {
      translate: 0 calc(-1 * var(--ni-8));
    }
    to {
      translate: 0 var(--ni-8);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-thanks-posters li {
      animation: none;
    }
  }

  .yir-thanks-posters :global(img) {
    transition:
      transform calc(var(--yir-beat) * 5) var(--yir-ease),
      box-shadow calc(var(--yir-beat) * 5) ease;
  }

  @media (hover: hover) {
    .yir-thanks-posters li:hover :global(img) {
      transform: translateY(calc(-1 * var(--ni-12))) rotate(-2deg);
      box-shadow: 0 var(--ni-24) var(--ni-48)
        color-mix(in srgb, var(--color-yir-accent) 35%, transparent);
    }
  }
</style>
