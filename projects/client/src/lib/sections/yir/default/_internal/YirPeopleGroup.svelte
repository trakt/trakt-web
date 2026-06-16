<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { m } from "$lib/paraglide/messages";
  import type {
    YirPeopleType,
    YirPerson,
  } from "$lib/requests/models/YirPerson";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { DEFAULT_AVATAR } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useYirPeople } from "../../_internal/useYirPeople";
  import YirSectionHeader from "./YirSectionHeader.svelte";

  const {
    slug,
    year,
    type,
    label,
  }: {
    slug: string;
    year: number;
    type: YirPeopleType;
    label: string;
  } = $props();

  const { people, isLoading } = $derived(useYirPeople({ slug, year, type }));

  const ITEMS_PER_ROW = 5;

  let currentPage = $state(0);
  let viewportEl: HTMLDivElement | undefined;
  let rowHeight = $state(0);

  const totalPages = $derived(
    Math.ceil(($people?.length ?? 0) / ITEMS_PER_ROW),
  );

  const hasPrevious = $derived(currentPage > 0);
  const hasNext = $derived(currentPage < totalPages - 1);
  const multiPage = $derived(totalPages > 1);

  function measureRowHeight() {
    if (!viewportEl) return;
    const firstLink = viewportEl.querySelector(
      ".yir-person-link",
    ) as HTMLElement | null;
    if (firstLink) {
      rowHeight = firstLink.offsetHeight;
    }
  }

  function goToPage(page: number) {
    measureRowHeight();
    currentPage = page;
    viewportEl?.scrollTo({
      top: page * rowHeight,
      behavior: "smooth",
    });
  }

  function observeResize(node: HTMLDivElement) {
    viewportEl = node;
    measureRowHeight();

    // Row height depends on the width of each `.yir-person-link` (the
    // circular headshot scales with its container), so re-measure whenever
    // the viewport resizes and keep the scroll aligned with the current page.
    const resizeObserver = new ResizeObserver(() => {
      measureRowHeight();
      node.scrollTo({ top: currentPage * rowHeight, behavior: "instant" });
    });
    resizeObserver.observe(node);

    return { destroy: () => resizeObserver.disconnect() };
  }

  function personUrl(person: YirPerson): string {
    return UrlBuilder.people(person.slug);
  }
</script>

{#if $isLoading}
  <div class="trakt-yir-people-group">
    <YirSectionHeader compact>
      {label}
    </YirSectionHeader>
    <p class="yir-people-loading">{m.yir_state_loading()}</p>
  </div>
{:else if $people && $people.length > 0}
  <div class="trakt-yir-people-group">
    <YirSectionHeader compact noTopPadding={type === "actresses"}>
      {label}
    </YirSectionHeader>

    {#if multiPage}
      <button
        class="yir-pager"
        class:invisible={!hasPrevious}
        onclick={() => goToPage(currentPage - 1)}
      >
        <span class="yir-pager-chevron">&and;</span>
        <span class="yir-pager-text">{m.yir_button_previous()}</span>
        <span class="yir-pager-chevron">&and;</span>
      </button>
    {/if}

    <div
      class="yir-people-viewport"
      use:observeResize
      style:height={rowHeight > 0 ? `${rowHeight}px` : "auto"}
    >
      <div class="yir-people-wrapper">
        {#each $people as person, index (person.slug)}
          {@const isDefault = PLACEHOLDERS.includes(person.headshot.url.thumb)}
          <Tooltip
            variant="default"
            disabled={person.titles.length === 0}
            side="top"
          >
            {#snippet content()}
              {#each person.titles as title (title.traktId)}
                <div class="yir-tooltip-title">
                  {#if title.type === "show" && title.episodeCount}
                    <span>{title.title} —</span>
                    <span class="yir-episode-count">
                      {title.episodeCount}
                      {title.episodeCount === 1 ? "episode" : "episodes"}
                    </span>
                  {:else}
                    <span>{title.title}</span>
                  {/if}
                </div>
              {/each}
            {/snippet}
            <div class="yir-person-link">
              <Link href={personUrl(person)}>
                <div class="yir-person">
                  <span class="yir-rank">{index + 1}</span>
                  <div class="yir-headshot">
                    <img
                      src={isDefault
                        ? DEFAULT_AVATAR
                        : person.headshot.url.thumb}
                      alt={person.name}
                      class="yir-headshot-img"
                      class:is-default={isDefault}
                    />
                  </div>
                  <h2 class="yir-person-name">{person.name}</h2>
                  <h3 class="yir-person-count">
                    {#if person.count.movies > 0}
                      {person.count.movies}
                      {person.count.movies === 1 ? "movie" : "movies"}
                    {:else}
                      &nbsp;
                    {/if}
                  </h3>
                  <h3 class="yir-person-count">
                    {#if person.count.shows > 0}
                      {person.count.shows}
                      {person.count.shows === 1 ? "show" : "shows"}
                    {:else}
                      &nbsp;
                    {/if}
                  </h3>
                </div>
              </Link>
            </div>
          </Tooltip>
        {/each}
      </div>
    </div>

    {#if multiPage}
      <button
        class="yir-pager"
        class:invisible={!hasNext}
        onclick={() => goToPage(currentPage + 1)}
      >
        <span class="yir-pager-chevron">&or;</span>
        <span class="yir-pager-text">{m.yir_button_see_more()}</span>
        <span class="yir-pager-chevron">&or;</span>
      </button>
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-people-group {
    overflow: hidden;
    padding-bottom: var(--ni-30);
  }

  .yir-people-loading {
    text-align: center;
    opacity: 0.5;
    color: var(--shade-10);
  }

  .yir-pager {
    -webkit-tap-highlight-color: transparent;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: var(--gap-xs);
    padding: var(--ni-10) 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--shade-500);
    transition: color 0.3s;

    &:hover {
      color: var(--shade-300);
    }

    &.invisible {
      visibility: hidden;
    }
  }

  .yir-pager-chevron {
    font-size: var(--font-size-tag);
    line-height: 1;
  }

  .yir-pager-text {
    font-size: var(--ni-12);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .yir-people-viewport {
    overflow: hidden;
  }

  .yir-people-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    &:hover :global(.trakt-tooltip-trigger:not(:hover) .yir-person) {
      opacity: 0.5;
    }

    :global(.trakt-tooltip-trigger) {
      width: 20%;

      @include for-mobile {
        width: 50%;
      }
    }
  }

  .yir-person-link {
    width: 100%;

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
      color: var(--shade-10);
    }

    @include for-mouse {
      &:hover {
        .yir-headshot {
          box-shadow: 0 0 var(--ni-20) var(--purple-500);

          &::after {
            border-color: var(--purple-500);
          }
        }

        .yir-person-name {
          color: var(--purple-500);
        }

        .yir-person-count {
          color: var(--shade-100);
        }
      }
    }
  }

  .yir-person {
    margin: var(--ni-20) 0 var(--ni-10) 0;
    padding: 0 var(--ni-14);
    transition: all 0.5s;
    text-align: center;
    position: relative;
  }

  .yir-rank {
    position: absolute;
    top: 0;
    left: var(--ni-14);
    color: var(--shade-10);
    font-weight: bold;
    font-size: var(--ni-12);
    z-index: 2;
    text-shadow: 0 var(--ni-1) var(--ni-2)
      color-mix(in srgb, var(--shade-1000) 80%, transparent);
  }

  .yir-headshot {
    background-color: var(--shade-1000);
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    transition: box-shadow 0.5s;

    &::before {
      content: "";
      padding-top: 100%;
      float: left;
    }

    &::after {
      content: "";
      position: absolute;
      border-radius: 100%;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 0 var(--ni-104) var(--shade-1000);
      left: 0;
      top: 0;
      border: var(--border-thickness-xxs) solid var(--shade-600);
      transition: border-color 0.5s;
    }
  }

  .yir-headshot-img {
    width: 100%;
    position: absolute;
    top: -10%;
    left: 0;

    &.is-default {
      top: 0;
    }
  }

  .yir-person-name {
    font-size: var(--ni-16);
    margin-top: var(--ni-12);
    margin-bottom: var(--ni-8);
    color: var(--shade-10);
    transition: all 0.5s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include for-mobile {
      font-size: var(--ni-12);
    }
  }

  .yir-person-count {
    font-size: var(--ni-12);
    text-transform: uppercase;
    color: var(--shade-300);
    margin: var(--ni-2) 0 0 0;
    transition: all 0.5s;

    @include for-mobile {
      font-size: var(--font-size-tag);
    }
  }

  .yir-tooltip-title {
    text-align: center;
  }

  .yir-episode-count {
    font-style: italic;
  }
</style>
