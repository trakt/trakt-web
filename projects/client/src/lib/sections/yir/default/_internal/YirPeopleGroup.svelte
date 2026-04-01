<script lang="ts">
  import type { YirPeopleType, YirPerson } from "$lib/requests/models/YirPerson";
  import { useYirPeople } from "../../_internal/useYirPeople";
  import { m } from "$lib/paraglide/messages";

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

  const { people, isLoading } = $derived(
    useYirPeople({ slug, year, type }),
  );

  const ITEMS_PER_ROW = 5;

  let currentPage = $state(0);
  let viewportEl = $state<HTMLDivElement | undefined>(undefined);
  let rowHeight = $state(0);
  let hoveredPerson = $state<number | null>(null);
  let tooltipPosition = $state<{ x: number; y: number } | null>(null);

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

  $effect(() => {
    if (viewportEl) {
      measureRowHeight();
    }
  });

  function personUrl(person: YirPerson): string {
    return `/people/${person.slug}`;
  }

  function handlePersonMouseEnter(event: MouseEvent, index: number) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    hoveredPerson = index;
    tooltipPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    };
  }

  function handlePersonMouseLeave() {
    hoveredPerson = null;
    tooltipPosition = null;
  }
</script>

{#if $isLoading}
  <div class="yir-people-group">
    <div class="yir-section-header">
      <h2>
        <span class="yir-header-text">{label}</span>
      </h2>
    </div>
    <p class="yir-people-loading">{m.yir_state_loading()}</p>
  </div>
{:else if $people && $people.length > 0}
  <div class="yir-people-group">
    <div class="yir-section-header" class:no-top-padding={type === "actresses"}>
      <h2>
        <span class="yir-header-text">{label}</span>
      </h2>
    </div>

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
      bind:this={viewportEl}
      style:height={rowHeight > 0 ? `${rowHeight}px` : "auto"}
    >
      <div class="yir-people-wrapper">
        {#each $people as person, index}
          <a
            href={personUrl(person)}
            class="yir-person-link"
            onmouseenter={(e) => handlePersonMouseEnter(e, index)}
            onmouseleave={handlePersonMouseLeave}
          >
            <div class="yir-person">
              <span class="yir-rank">{index + 1}</span>
              <div class="yir-headshot">
                <img
                  src={person.headshot.url.thumb}
                  alt={person.name}
                  class="yir-headshot-img"
                />
              </div>
              <h2 class="yir-person-name">{person.name}</h2>
              {#if person.count.movies > 0}
                <h3 class="yir-person-count">
                  {person.count.movies} {person.count.movies === 1 ? "movie" : "movies"}
                </h3>
              {/if}
              {#if person.count.shows > 0}
                <h3 class="yir-person-count">
                  {person.count.shows} {person.count.shows === 1 ? "show" : "shows"}
                </h3>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </div>

    {#if hoveredPerson !== null && tooltipPosition && $people}
      {@const person = $people[hoveredPerson]}
      {#if person?.titles.length > 0}
        <div
          class="yir-person-tooltip"
          style:left="{tooltipPosition.x}px"
          style:top="{tooltipPosition.y}px"
        >
          {#each person.titles as title}
            <div class="yir-tooltip-title">
              {#if title.type === "show" && title.episodeCount}
                {title.title} — <span class="yir-episode-count">{title.episodeCount} {title.episodeCount === 1 ? "episode" : "episodes"}</span>
              {:else}
                {title.title}
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    {/if}

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
  @use "./shared" as *;

  .yir-people-group {
    overflow: hidden;
    padding-bottom: 30px;
  }

  .yir-section-header {
    &.no-top-padding {
      padding-top: 0;
    }

    @include for-mobile {
      padding: 40px 0 15px 0;

      &.no-top-padding {
        padding-top: 0;
      }
    }
  }

  .yir-people-loading {
    text-align: center;
    opacity: 0.5;
    color: #fff;
  }

  .yir-pager {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 8px;
    padding: 10px 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    transition: color 0.3s;

    &:hover {
      color: #aaa;
    }

    &.invisible {
      visibility: hidden;
    }
  }

  .yir-pager-chevron {
    font-size: 10px;
    line-height: 1;
  }

  .yir-pager-text {
    font-size: 11px;
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

    &:hover {
      .yir-person {
        opacity: 0.5;
      }
    }
  }

  .yir-person-link {
    text-decoration: none;
    color: #fff;
    width: 20%;

    &:hover {
      .yir-person {
        opacity: 1 !important;
      }

      .yir-headshot {
        box-shadow: 0 0 20px var(--purple-500);

        &::after {
          border-color: var(--purple-500);
        }
      }

      .yir-person-name {
        color: var(--purple-500);
      }

      .yir-person-count {
        color: #ccc;
      }
    }

    @include for-mobile {
      width: 50%;
    }
  }

  .yir-person {
    margin: 20px 0 10px 0;
    padding: 0 13px;
    transition: all 0.5s;
    text-align: center;
    position: relative;
  }

  .yir-rank {
    position: absolute;
    top: 0;
    left: 13px;
    color: #fff;
    font-weight: bold;
    font-size: 13px;
    z-index: 2;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  }

  .yir-headshot {
    background-color: #000;
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
      box-shadow: 0 0 0 100px #000;
      left: 0;
      top: 0;
      border: solid 1px #555;
      transition: border-color 0.5s;
    }
  }

  .yir-headshot-img {
    width: 100%;
    position: absolute;
    top: -10%;
    left: 0;
  }

  .yir-person-name {
    font-size: 15px;
    margin-top: 12px;
    margin-bottom: 7px;
    color: #fff;
    transition: all 0.5s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include for-mobile {
      font-size: 13px;
    }
  }

  .yir-person-count {
    font-size: 11px;
    text-transform: uppercase;
    color: #aaa;
    margin: 2px 0 0 0;
    transition: all 0.5s;

    @include for-mobile {
      font-size: 10px;
    }
  }

  .yir-person-tooltip {
    position: fixed;
    transform: translate(-50%, -100%);
    background: rgba(0, 0, 0, 0.92);
    border: 1px solid #3a3a3a;
    border-radius: 6px;
    padding: 8px 12px;
    white-space: nowrap;
    z-index: 10;
    font-size: 12px;
    line-height: 1.6;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    font-family: inherit;

    @include for-mobile {
      display: none;
    }
  }

  .yir-tooltip-title {
    color: #fff;
    text-align: center;
  }

  .yir-episode-count {
    font-style: italic;
  }
</style>
