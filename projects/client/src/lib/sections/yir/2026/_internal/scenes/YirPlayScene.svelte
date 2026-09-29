<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { YirWatchedItem } from "$lib/requests/models/YirDetail";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    label,
    item,
  }: {
    id: string;
    index: number;
    label: string;
    item: YirWatchedItem;
  } = $props();

  const date = $derived(
    new Intl.DateTimeFormat(languageTag(), {
      month: "long",
      day: "numeric",
    }).format(item.watchedAt),
  );
  const time = $derived(
    new Intl.DateTimeFormat(languageTag(), { timeStyle: "short" }).format(
      item.watchedAt,
    ),
  );
</script>

<YirScene {id} {index} kicker={label} title={date} lead={time}>
  {#snippet children(isInView)}
    <Link
      href={UrlBuilder.media(item.entry.type, item.entry.slug)}
      color="inherit"
    >
      <figure class="yir-play" class:is-in={isInView} data-reveal>
        <div class="yir-play-frame">
          <CrossOriginImage src={item.entry.cover.url.medium} alt="" />
        </div>
        <figcaption>
          <span data-hover-line class="yir-play-title">{item.entry.title}</span>
          {#if item.type === "episode"}
            <span class="yir-play-episode">
              <b>S{item.episode.season} · E{item.episode.number}</b>
              {item.episode.title}
            </span>
          {/if}
        </figcaption>
      </figure>
    </Link>
  {/snippet}
</YirScene>

<style lang="scss">
  .yir-play {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
    margin: 0;
  }

  .yir-play-frame {
    position: relative;
    aspect-ratio: 2.39 / 1;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-yir-surface-chip);

    @media (max-width: 40rem) {
      aspect-ratio: 16 / 10;
    }

    :global(img) {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.12);
      transition: transform calc(var(--yir-beat) * 24) var(--yir-ease);
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 0 var(--ni-1)
        color-mix(in srgb, var(--color-yir-text-primary) 12%, transparent);
      border-radius: inherit;
    }
  }

  .is-in .yir-play-frame :global(img) {
    transform: scale(1);
  }

  figcaption {
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);
  }

  .yir-play-title {
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-32), 5vw, var(--ni-72));
    line-height: 1.2;
    color: var(--color-yir-text-accent);
  }

  .yir-play-episode {
    font-size: var(--font-size-title);
    color: var(--color-yir-text-secondary);

    b {
      font-family: var(--yir-font-mono);
      font-size: var(--font-size-text);
      color: var(--color-yir-text-primary);
      margin-inline-end: var(--ni-8);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-play-frame :global(img) {
      transform: none;
      transition: none;
    }
  }

  .yir-play-frame {
    clip-path: inset(0 round var(--border-radius-m));
    transition: clip-path calc(var(--yir-beat) * 14) cubic-bezier(0.7, 0, 0.2, 1) calc(var(--yir-beat) * 2);
  }

  .yir-play:not(.is-in) .yir-play-frame {
    clip-path: inset(18% 0 round var(--border-radius-m));
  }

  @media (hover: hover) {
    .yir-play-frame :global(img) {
      transition: transform calc(var(--yir-beat) * 24) var(--yir-ease), scale calc(var(--yir-beat) * 12) var(--yir-ease);
    }

    .yir-play:hover .yir-play-frame :global(img) {
      scale: 1.03;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-play-frame,
    .yir-play:not(.is-in) .yir-play-frame {
      clip-path: none;
      transition: none;
    }
  }
</style>
