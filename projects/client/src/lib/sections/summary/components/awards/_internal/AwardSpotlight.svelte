<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import LaurelIcon from "$lib/components/icons/LaurelIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import type { AwardEntry } from "$lib/requests/models/AwardEntry";
  import { toHumanETA } from "$lib/utils/formatting/date/toHumanETA";
  import { toHumanWeekdayDate } from "$lib/utils/formatting/date/toHumanWeekdayDate";
  import { toInitials } from "$lib/utils/string/toInitials.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import AwardsLiveLine from "./AwardsLiveLine.svelte";
  import AwardTag from "./AwardTag.svelte";
  import { toAwardEdition } from "./toAwardEdition.ts";
  import { toAwardSeasonPhase } from "./toAwardSeasonPhase.ts";
  import { toAwardCategoryName } from "./toAwardCategoryName.ts";

  const {
    entry,
    today,
    isWide = false,
  }: { entry: AwardEntry; today: Date; isWide?: boolean } = $props();

  let isFaceMissing = $state(false);

  const kicker = $derived(
    [toAwardEdition(entry.ceremony), entry.year].join(" · "),
  );

  const status = $derived.by(() => {
    const heldAt = entry.ceremony.heldAt;
    if (!heldAt) return null;

    const locale = getLocale();
    switch (toAwardSeasonPhase({ entries: [entry], today })) {
      case "pre":
        return m.text_award_results_on({
          date: toHumanWeekdayDate(heldAt, locale),
          eta: toHumanETA(today, heldAt, locale),
        });
      case "post":
        return m.text_award_announced_on({
          date: toHumanWeekdayDate(heldAt, locale),
        });
      case "none":
        return null;
    }
  });
</script>

{#snippet card()}
  <article
    class="trakt-award-spotlight"
    class:is-won={entry.won}
    class:is-link={entry.person != null}
    data-layout={isWide ? "wide" : "tile"}
  >
    <span class="spotlight-mark" aria-hidden="true"><LaurelIcon /></span>

    {#if entry.person}
      <span class="spotlight-face">
        {#if isFaceMissing}
          <span class="spotlight-initials bold" aria-hidden="true">
            {toInitials(entry.person.name)}
          </span>
        {:else}
          <CrossOriginImage
            src={entry.person.headshot.url.thumb}
            alt={m.image_alt_person_headshot({ person: entry.person.name })}
            onmissing={() => (isFaceMissing = true)}
          />
        {/if}
        <span class="spotlight-pin"><LaurelIcon /></span>
      </span>
    {:else}
      <span class="spotlight-medal"><LaurelIcon /></span>
    {/if}

    <div class="spotlight-body">
      <p class="small secondary">{kicker}</p>
      <h3 class="spotlight-title">{toAwardCategoryName(entry.category)}</h3>
      {#if entry.person}
        <span class="spotlight-name small bold">{entry.person.name}</span>
      {/if}
    </div>

    <div class="spotlight-status">
      <AwardTag won={entry.won} variant="inline" />
      {#if status}
        <AwardsLiveLine text={status} />
      {/if}
    </div>
  </article>
{/snippet}

{#if entry.person}
  <Link
    href={UrlBuilder.people(entry.person.slug)}
    color="inherit"
    underline="none"
  >
    {@render card()}
  </Link>
{:else}
  {@render card()}
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-award-spotlight {
    --spotlight-media-size: var(--ni-88);

    position: relative;
    overflow: hidden;
    isolation: isolate;
    box-sizing: border-box;

    display: grid;
    grid-template-columns: var(--spotlight-media-size) minmax(0, 1fr);
    align-items: center;
    align-content: center;
    column-gap: var(--gap-l);
    row-gap: var(--gap-s);

    min-height: var(--ni-136);
    padding: var(--gap-l);

    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      var(--color-award-row-edge);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, box-shadow;

    :global(.trakt-link:focus-visible) & {
      box-shadow: inset 0 0 0 var(--border-thickness-xs)
        var(--color-link-active);
    }

    @include for-mouse {
      &.is-link:hover {
        background:
          linear-gradient(
            var(--color-award-chip-hover),
            var(--color-award-chip-hover)
          ),
          var(--color-card-background);
      }
    }

    &[data-layout="wide"] {
      grid-template-columns: var(--spotlight-media-size) minmax(0, 1fr) auto;
      min-height: var(--ni-148);
      padding: var(--gap-l) var(--gap-xl);

      .spotlight-medal,
      .spotlight-face {
        grid-row: auto;
      }

      .spotlight-body {
        align-self: center;
      }

      .spotlight-title {
        font-size: var(--ni-24);
      }

      .spotlight-status {
        grid-column: 3;
        flex-direction: column;
        align-items: flex-end;
        padding-inline-end: var(--ni-120);
      }
    }

    @include for-mobile {
      --spotlight-media-size: var(--ni-64);

      column-gap: var(--gap-s);
      padding: var(--gap-m);

      &[data-layout="wide"] {
        grid-template-columns: var(--spotlight-media-size) minmax(0, 1fr);
        padding: var(--gap-m);

        .spotlight-title {
          font-size: var(--font-size-title);
        }

        .spotlight-status {
          grid-column: 2;
          flex-direction: row;
          align-items: center;
          padding-inline-end: 0;
        }
      }
    }
  }

  .trakt-award-spotlight {
    --spotlight-motion: calc(var(--transition-increment) * 3)
      cubic-bezier(0.16, 1, 0.3, 1);

    &.is-won::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;

      background: linear-gradient(
        110deg,
        transparent 35%,
        var(--color-award-gold-soft) 50%,
        transparent 65%
      );
      translate: calc(var(--rtl-sign) * -100%) 0;
    }

    @media (prefers-reduced-motion: no-preference) {
      .spotlight-face,
      .spotlight-medal,
      .spotlight-mark {
        transition:
          scale var(--spotlight-motion),
          rotate var(--spotlight-motion);
      }

      @include for-mouse {
        &.is-link:hover {
          .spotlight-face,
          .spotlight-medal {
            scale: 1.05;
          }

          .spotlight-mark {
            rotate: calc(var(--rtl-sign) * -8deg);
            scale: 1.06;
          }
        }

        &.is-link.is-won:hover::after {
          translate: calc(var(--rtl-sign) * 100%) 0;
          transition: translate calc(var(--transition-increment) * 6) ease-out;
        }
      }
    }
  }

  .spotlight-mark {
    position: absolute;
    inset-inline-end: calc(-1 * var(--ni-40));
    inset-block-start: 50%;
    z-index: -1;

    display: grid;
    translate: 0 -50%;

    color: var(--color-text-primary);
    opacity: 0.04;

    :global(svg) {
      width: var(--ni-208);
      height: var(--ni-208);
    }
  }

  .spotlight-medal,
  .spotlight-face {
    grid-row: span 2;
    width: var(--spotlight-media-size);
    height: var(--spotlight-media-size);
  }

  .spotlight-medal {
    display: grid;
    place-items: center;

    border-radius: 50%;
    background: var(--color-award-tag-background);
    color: var(--color-award-nominee);

    :global(svg) {
      width: 60%;
      height: 60%;
    }

    .is-won & {
      background: var(--color-award-gold-soft);
      box-shadow: inset 0 0 0 var(--ni-1) var(--color-award-tag-won-ring);
      color: var(--color-award-gold);
    }
  }

  .spotlight-face {
    position: relative;
    border-radius: 50%;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 20%;
      border-radius: 50%;
    }

    .is-won & {
      box-shadow:
        0 0 0 var(--border-thickness-xs) var(--color-card-background),
        0 0 0 var(--ni-4) var(--color-award-tag-won-ring);
    }
  }

  .spotlight-initials {
    display: grid;
    place-items: center;

    width: 100%;
    height: 100%;
    border-radius: 50%;

    background: var(--color-award-tag-background);
    color: var(--color-text-secondary);
    font-size: var(--font-size-title);
  }

  .spotlight-name {
    color: var(--color-link-active);
  }

  .spotlight-pin {
    position: absolute;
    inset-block-end: calc(-1 * var(--ni-2));
    inset-inline-end: calc(-1 * var(--ni-2));

    display: grid;
    place-items: center;

    width: 36%;
    height: 36%;

    border-radius: 50%;
    background: var(--color-card-background);
    color: var(--color-award-nominee);

    :global(svg) {
      width: 62%;
      height: 62%;
    }

    .is-won & {
      color: var(--color-award-gold);
    }
  }

  .spotlight-body {
    min-width: 0;
    align-self: end;

    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .spotlight-title {
    font-size: var(--font-size-title);
    line-height: 1.2;
  }

  .spotlight-status {
    grid-column: 2;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xs) var(--gap-s);
  }
</style>
