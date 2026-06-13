<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { m } from "$lib/paraglide/messages";
  import type {
    YirPerson,
    YirPersonTitle,
  } from "$lib/requests/models/YirPerson.ts";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { DEFAULT_AVATAR } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  type Yir2024PersonRowProps = {
    person: YirPerson;
    rank: number;
  };

  const { person, rank }: Yir2024PersonRowProps = $props();

  let expanded = $state(false);

  const rankLabel = $derived(String(rank).padStart(2, "0"));
  const personUrl = $derived(UrlBuilder.people(person.slug));
  const isDefaultAvatar = $derived(
    !person.headshot.url.thumb ||
      PLACEHOLDERS.includes(person.headshot.url.thumb),
  );
  const avatarSrc = $derived(
    isDefaultAvatar ? DEFAULT_AVATAR : person.headshot.url.thumb,
  );
  const hasTitles = $derived(person.titles.length > 0);

  // Trailing detail for an expanded title: episode count for shows, release
  // year for movies.
  function titleMeta(title: YirPersonTitle): string {
    if (title.type === "show" && title.episodeCount) {
      return `— ${m.yir_2024_people_episode_count({ count: title.episodeCount })}`;
    }
    return title.year ? `(${title.year})` : "";
  }
</script>

{#snippet countsContent()}
  {#if person.count.shows > 0}
    <span>{m.yir_2024_people_show_count({ count: person.count.shows })}</span>
  {/if}
  {#if person.count.movies > 0}
    <span>{m.yir_2024_people_movie_count({ count: person.count.movies })}</span>
  {/if}
{/snippet}

<li class="yir-2024-person" class:is-expanded={expanded} role="listitem">
  <div class="yir-2024-person-main">
    <span class="yir-2024-person-rank">{rankLabel}</span>

    <img
      class="yir-2024-person-avatar"
      class:is-default={isDefaultAvatar}
      src={avatarSrc}
      alt={person.name}
      loading="lazy"
    />

    <div class="yir-2024-person-text">
      <Link href={personUrl} color="inherit">
        <span class="yir-2024-person-name">{person.name}</span>
      </Link>

      {#if hasTitles}
        <button
          type="button"
          class="yir-2024-person-counts"
          aria-expanded={expanded}
          aria-controls="titles-{person.id}"
          onclick={() => (expanded = !expanded)}
        >
          {@render countsContent()}
        </button>
      {:else}
        <span class="yir-2024-person-counts">
          {@render countsContent()}
        </span>
      {/if}
    </div>

    {#if hasTitles}
      <button
        type="button"
        class="yir-2024-person-seen-in"
        aria-expanded={expanded}
        aria-controls="titles-{person.id}"
        aria-label={m.yir_2024_people_seen_in()}
        onclick={() => (expanded = !expanded)}
      >
        <span class="yir-2024-person-caret"><CaretRightIcon /></span>
      </button>
    {/if}
  </div>

  {#if expanded}
    <ul id="titles-{person.id}" class="yir-2024-person-titles" role="list">
      {#each person.titles as title (title.traktId)}
        {@const meta = titleMeta(title)}
        <li class="yir-2024-person-title" role="listitem">
          <Link
            href={UrlBuilder.media(title.type, String(title.traktId))}
            color="inherit"
          >
            <span class="yir-2024-person-title-icon">
              {#if title.type === "movie"}
                <MovieIcon />
              {:else}
                <ShowIcon />
              {/if}
            </span>
            <span class="yir-2024-person-title-text"
              >{title.title}{#if meta}&nbsp;{meta}{/if}</span
            >
          </Link>
        </li>
      {/each}
    </ul>
  {/if}
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-2024-person {
    border-bottom: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--shade-700) 60%, transparent);

    &:last-child {
      border-bottom: none;
    }
  }

  .yir-2024-person-main {
    display: flex;
    align-items: center;
    gap: var(--ni-12);
    padding: var(--ni-10) 0;
  }

  .yir-2024-person-rank {
    flex: none;
    min-width: var(--ni-24);
    font-size: var(--ni-16);
    color: var(--shade-500);
  }

  // Name on line 1, watched counts stacked beneath it on line 2. Flexes to
  // fill the row so the chevron stays pinned right.
  .yir-2024-person-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  // Only the name links to the person; make it block so it truncates to the
  // column width.
  .yir-2024-person-text :global(.trakt-link) {
    display: block;
    min-width: 0;
    text-decoration: none;
  }

  .yir-2024-person-avatar {
    flex: none;
    width: var(--ni-40);
    height: var(--ni-40);
    border-radius: 50%;
    object-fit: cover;
    background-color: var(--shade-800);
  }

  .yir-2024-person-name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--ni-18);
    transition: color 0.2s;
  }

  @include for-mouse {
    // `.yir-2024-person-name` is scoped to this component, so the global
    // `.trakt-link` hover only matches names rendered here.
    :global(.trakt-link:hover) .yir-2024-person-name {
      color: var(--purple-300);
    }
  }

  // Clicking the counts toggles the expansion like the chevron, so it's a
  // button — reset the chrome to a plain gray label that lightens on hover.
  // `.uppercase` only targets p/span/h1-6/code, so uppercase is set here.
  .yir-2024-person-counts {
    align-self: flex-start;
    display: inline-flex;
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--shade-500);
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s;
  }

  // Override the global `span { font-size }` so the count text is actually
  // small; a bullet separates the show + movie counts when both are present.
  .yir-2024-person-counts span {
    font-size: var(--font-size-tag);
  }

  .yir-2024-person-counts span + span::before {
    content: "•";
    margin: 0 var(--ni-4);
  }

  .yir-2024-person-counts:hover {
    color: var(--shade-300);
  }

  // Text dropped — a purple circle around the chevron keeps the button
  // affordance for the expand toggle.
  .yir-2024-person-seen-in {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-28);
    height: var(--ni-28);
    border: none;
    border-radius: 50%;
    background-color: var(--purple-500);
    cursor: pointer;
    color: var(--shade-10);
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--purple-400);
    }
  }

  .yir-2024-person-caret {
    display: inline-flex;
    transition: transform 0.2s;
    // CaretRightIcon points right; rotate it down while collapsed.
    transform: rotate(90deg);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }

  .yir-2024-person.is-expanded .yir-2024-person-caret {
    transform: rotate(-90deg);
  }

  .yir-2024-person-titles {
    list-style: none;
    margin: 0;
    // Left-aligned to the row edge (under the rank), not indented under the name.
    padding: 0 0 var(--ni-16);
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .yir-2024-person-title {
    font-size: var(--font-size-text);
  }

  .yir-2024-person-title :global(.trakt-link) {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-8);
    text-decoration: none;
    color: var(--shade-100);
    transition: color 0.2s;
  }

  @include for-mouse {
    .yir-2024-person-title :global(.trakt-link):hover {
      color: var(--purple-300);
    }
  }

  .yir-2024-person-title-icon {
    flex: none;
    display: inline-flex;
    color: var(--shade-400);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
