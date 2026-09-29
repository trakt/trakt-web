<script lang="ts">
  import { yirBeats } from "../persona/yirBeats";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { YirPeopleType, YirPerson } from "$lib/requests/models/YirPerson";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { DEFAULT_AVATAR } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useYirPeople } from "../../../_internal/useYirPeople";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  const {
    slug,
    year,
    type,
    role,
  }: {
    slug: string;
    year: number;
    type: YirPeopleType;
    role: string;
  } = $props();

  const { people } = $derived(useYirPeople({ slug, year, type }));

  let openId = $state<number | null>(null);
  const toggle = (id: number) => {
    openId = openId === id ? null : id;
  };

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const headshot = (person: YirPerson) =>
    !person.headshot.url.thumb || PLACEHOLDERS.includes(person.headshot.url.thumb)
      ? DEFAULT_AVATAR
      : person.headshot.url.thumb;

  const count = (person: YirPerson) =>
    person.count.movies >= person.count.shows
      ? m.yir_2024_people_movie_count({ count: person.count.movies })
      : m.yir_2024_people_show_count({ count: person.count.shows });
</script>

{#if ($people?.length ?? 0) > 0}
  <div class="yir-credits-column" data-reveal>
    <span class="yir-credits-role">{role}</span>
    <ol>
      {#each ($people ?? []).slice(0, 5) as person, position (person.id)}
        <li class:is-lead={position === 0} style:--i={position}>
          <button
            class="yir-credits-toggle"
            type="button"
            class:is-open={openId === person.id}
            aria-expanded={openId === person.id}
            disabled={person.titles.length === 0}
            onclick={() => toggle(person.id)}
          >
              <span class="yir-credits-avatar">
                <CrossOriginImage src={headshot(person)} alt="" />
              </span>
              <span class="yir-credits-copy">
                <span class="yir-credits-name">{person.name}</span>
                <span class="yir-credits-count">{count(person)}</span>
              </span>
              {#if person.titles.length > 0}
                <span class="yir-credits-caret" aria-hidden="true"><CaretRightIcon /></span>
              {/if}
          </button>
          {#if openId === person.id}
            <div
              class="yir-credits-titles"
              transition:slide={{ duration: $isReducedMotion ? 0 : yirBeats(3.2), easing: cubicOut }}
            >
              <Link href={UrlBuilder.people(person.slug)} color="inherit">
                <b data-hover-line>{person.name}</b>
              </Link>
              <span>{m.yir_2024_people_seen_in()}</span>
              <ul>
                {#each person.titles as title (title.key)}
                  <li>
                    <Link href={UrlBuilder.media(title.type, String(title.traktId))} color="inherit">
                      <span data-hover-line>{title.title}</span>
                    </Link>
                    {#if title.type === "show" && title.episodeCount}
                      <small>{m.yir_2024_people_episode_count({ count: title.episodeCount })}</small>
                    {:else if title.year}
                      <small>{title.year}</small>
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
{/if}

<style lang="scss">
  .yir-credits-column {
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    min-width: 0;

    ol {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    > ol > li {
      border-bottom: var(--ni-1) solid var(--color-yir-separator);
    }
  }

  .yir-credits-role {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-yir-text-accent);
  }

  .yir-credits-toggle {
    width: 100%;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: start;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ni-12);
    padding-block: var(--ni-12);
    cursor: pointer;
    list-style: none;
    -webkit-tap-highlight-color: transparent;
    border-radius: var(--border-radius-s);
    outline: none;

    &:focus-visible {
      outline: var(--ni-2) solid var(--color-yir-accent);
      outline-offset: var(--ni-4);
    }

    &:disabled {
      cursor: default;
    }
  }

  .yir-credits-avatar {
    width: var(--ni-48);
    height: var(--ni-48);
    border-radius: 50%;
    overflow: hidden;
    background: var(--color-yir-surface-chip);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(1) contrast(1.1);
      transition: filter var(--transition-increment);
    }
  }

  .is-lead .yir-credits-avatar {
    width: var(--ni-72);
    height: var(--ni-72);
    box-shadow: 0 0 0 var(--ni-2) var(--color-yir-accent);

    :global(img) {
      filter: none;
    }
  }

  .is-open .yir-credits-avatar :global(img),
  .yir-credits-toggle:hover .yir-credits-avatar :global(img) {
    filter: none;
  }

  .yir-credits-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
  }

  .yir-credits-name {
    font-family: var(--yir-font-display);
    font-size: var(--ni-20);
    line-height: 1.15;
    overflow-wrap: break-word;
  }

  .is-lead .yir-credits-name {
    font-size: clamp(var(--ni-20), 8cqi, var(--ni-36));
    color: var(--color-yir-text-accent);
  }

  .yir-credits-count {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    text-transform: uppercase;
    color: var(--color-yir-text-muted);
  }

  .yir-credits-caret {
    display: grid;
    place-items: center;
    color: var(--color-yir-text-muted);
    transition:
      transform calc(var(--yir-beat) * 3.2) var(--yir-ease),
      color var(--yir-t-quick) ease;

    :global([dir="rtl"]) & {
      transform: scaleX(-1);
    }
  }

  .is-open .yir-credits-caret {
    transform: rotate(90deg);
    color: var(--color-yir-accent);
  }

  .yir-credits-titles {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
    padding: 0 0 var(--ni-16) calc(var(--ni-48) + var(--ni-12));
    color: var(--color-yir-text-secondary);

    span {
      font-family: var(--yir-font-mono);
      font-size: var(--font-size-tag);
      text-transform: uppercase;
      color: var(--color-yir-text-muted);
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    small {
      margin-inline-start: var(--ni-8);
      color: var(--color-yir-text-muted);
    }
  }

  .yir-credits-column > ol > li {
    transition:
      opacity calc(var(--yir-beat) * 6) ease,
      translate var(--yir-t-reveal) var(--yir-ease);
    transition-delay: calc(var(--i) * var(--yir-beat) * 0.9 + var(--yir-beat) * 2.5);
  }

  :global(.trakt-yir-scene:not(.is-in)) .yir-credits-column > ol > li {
    opacity: 0;
    translate: 0 var(--ni-16);
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-credits-column > ol > li,
    :global(.trakt-yir-scene:not(.is-in)) .yir-credits-column > ol > li {
      opacity: 1;
      translate: none;
      transition: none;
    }
  }
</style>
