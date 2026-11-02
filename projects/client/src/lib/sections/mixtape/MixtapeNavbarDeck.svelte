<script lang="ts">
  import { page } from "$app/state";
  import Button from "$lib/components/buttons/Button.svelte";
  import EditModeIcon from "$lib/components/icons/EditModeIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import ToggleIcon from "$lib/components/toggles/ToggleIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { onDestroy } from "svelte";
  import { flyPosterToSlot } from "./_internal/flyPosterToSlot.ts";
  import { MAX_MIXTAPE_PICKS } from "./_internal/MAX_MIXTAPE_PICKS.ts";
  import { parseMixtapeParams } from "./_internal/parseMixtapeParams.ts";
  import { toMixAction } from "./_internal/toMixAction.ts";
  import {
    type MixtapeFlight,
    useMixtapeSession,
  } from "./_internal/useMixtapeSession.ts";

  const FLASH_DURATION = 420;
  const SHINE_DURATION = 1200;
  /*
    Below this width the labelled Movies / Shows toggle leaves no room for
    the placeholder, so the narrowest phones get the icons instead.
  */
  const NARROW_PHONE_QUERY = "(max-width: 360px)";

  const { layout = "strip" }: { layout?: "strip" | "docked" } = $props();

  const { session, flights, update } = useMixtapeSession();
  const { options } = useDiscover();
  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
  const isNarrowPhone = useMedia(NARROW_PHONE_QUERY);
  const { track } = useTrack(AnalyticsEvent.MixtapeMix);

  const params = $derived(parseMixtapeParams(page.url.searchParams));
  const isResults = $derived(params.view === "results");
  const isFull = $derived(params.picks.length >= MAX_MIXTAPE_PICKS);
  const action = $derived(toMixAction({ params, isMixing: $session.isMixing }));
  const isReady = $derived(
    action.state === "ready" || action.state === "mixing",
  );
  const trackMix = () =>
    track({ type: params.type, picks: action.count, fits: $session.fitCount });

  const typeOptions = $derived(
    options
      .filter(
        (option): option is typeof option & { value: MediaType } =>
          option.value === "movie" || option.value === "show",
      )
      .map((option) => ({
        value: option.value,
        text: option.text(),
        label: option.label(),
        href: UrlBuilder.mixtape({ type: option.value }),
      })),
  );

  /*
    The deck shows the picks and one add slot that steps right as they
    land; the add slot leaves once the deck is full or the mix is on.
  */
  const isAdding = $derived(!isFull && !isResults);
  const slots = $derived([
    ...params.picks.map((id, index) => ({
      index,
      id,
      media: $session.picked.find((item) => item.id === id) ?? null,
    })),
    ...(isAdding
      ? [{ index: params.picks.length, id: null, media: null }]
      : []),
  ]);

  const removeHref = (id: number) =>
    UrlBuilder.mixtape({
      type: params.type,
      picks: params.picks.filter((pick) => pick !== id),
      source: params.source ?? undefined,
    });
  const changeHref = $derived(
    UrlBuilder.mixtape({
      type: params.type,
      picks: params.picks,
      source: params.source ?? undefined,
    }),
  );

  let slotEls = $state<Array<HTMLElement | undefined>>([]);
  let landing = $state<number | null>(null);
  let flash = $state<number | null>(null);
  let isShining = $state(false);
  let flashTimer: ReturnType<typeof setTimeout> | undefined;
  let shineTimer: ReturnType<typeof setTimeout> | undefined;

  const land = async ({ id, src, from }: MixtapeFlight) => {
    const slotIndex = params.picks.includes(id)
      ? params.picks.indexOf(id)
      : params.picks.length;
    const target = slotEls[slotIndex];
    if (!target) return;

    landing = id;
    if (from) {
      await flyPosterToSlot({
        from,
        to: target.getBoundingClientRect(),
        src,
        isReducedMotion: $isReducedMotion,
      });
    }
    landing = null;

    flash = slotIndex;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => (flash = null), FLASH_DURATION);

    if (slotIndex < MAX_MIXTAPE_PICKS - 1) return;
    isShining = true;
    clearTimeout(shineTimer);
    shineTimer = setTimeout(() => (isShining = false), SHINE_DURATION);
  };

  const flightSubscription = flights.subscribe(land);

  onDestroy(() => {
    flightSubscription.unsubscribe();
    clearTimeout(flashTimer);
    clearTimeout(shineTimer);
  });
</script>

{#snippet typeIcon(option: SegmentedSelectOption<MediaType>)}
  <ToggleIcon {option} />
{/snippet}

<div
  class="trakt-mixtape-navbar-deck"
  data-layout={layout}
  data-view={params.view}
  data-full={isFull}
  data-shine={isShining}
>
  <div class="deck-search" inert={isResults || undefined}>
    <label class="deck-search-field">
      <SearchIcon />
      <input
        type="search"
        value={$session.search}
        aria-label={m.input_label_mixtape_search()}
        placeholder={params.type === "show"
          ? m.input_placeholder_mixtape_deck_shows()
          : m.input_placeholder_mixtape_deck_movies()}
        oninput={(event) => update({ search: event.currentTarget.value })}
      />
    </label>
    <div class="deck-search-type">
      <SegmentedSelect
        options={typeOptions}
        value={params.type}
        variant={$isNarrowPhone ? "compact" : "regular"}
        icon={$isNarrowPhone ? typeIcon : undefined}
        ariaLabel={m.page_title_mixtape()}
        onChange={() => update({ search: "" })}
      />
    </div>
  </div>

  <div class="deck-tray" data-ready={isReady}>
    <div
      class="deck-slots"
      role="group"
      aria-label={m.text_mixtape_pick_count({
        count: String(params.picks.length),
      })}
    >
      <span class="deck-shine" aria-hidden="true"></span>
      {#each slots as slot (slot.index)}
        <div
          class="deck-slot"
          bind:this={slotEls[slot.index]}
          data-filled={slot.media != null}
          data-add={slot.id == null}
          data-landing={landing != null && landing === slot.id}
          data-flash={flash === slot.index}
          inert={isResults || undefined}
        >
          {#if slot.media}
            <Link
              href={removeHref(slot.media.id)}
              noscroll
              replacestate
              color="inherit"
              label={m.button_label_mixtape_remove_pick({
                title: slot.media.title,
              })}
            >
              <CrossOriginImage
                src={slot.media.poster.url.thumb}
                alt=""
                loading="eager"
                animate={false}
              />
            </Link>
          {:else if slot.id == null}
            <span
              class="deck-slot-add"
              role="img"
              aria-label={params.type === "show"
                ? m.button_label_mixtape_add_show()
                : m.button_label_mixtape_add_movie()}
            >
              <PlusIcon />
            </span>
          {/if}
        </div>
      {/each}
      {#if isResults}
        <span class="deck-change">
          <Link
            href={changeHref}
            noscroll
            color="inherit"
            label={m.button_text_mixtape_change_picks()}
          >
            <EditModeIcon />
            {m.button_text_mixtape_change()}
          </Link>
        </span>
      {/if}
    </div>
    {#if layout === "docked"}
      <div class="deck-mix" inert={action.state !== "ready" || undefined}>
        <div class="deck-mix-inner">
          <Button
            href={action.href}
            color="purple"
            label={action.label}
            noscroll
            onclick={() => action.state === "ready" && trackMix()}
          >
            {action.label}
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-navbar-deck {
    --deck-height: calc(
      var(--segmented-select-segment-height) + 2 * var(--ni-4)
    );
    --deck-slot-width: var(--ni-28);
    --deck-slot-height: var(--ni-40);
    --deck-slot-gap: var(--ni-4);
    --deck-slot-radius: var(--ni-6);
    --deck-slide-duration: calc(3 * var(--transition-increment));
    --deck-slide-ease: cubic-bezier(0.34, 1.3, 0.5, 1);
    --deck-slide-distance: calc(var(--rtl-sign, 1) * var(--ni-60));
    --deck-slots-from: translateX(calc(-1 * var(--deck-slide-distance)));
    --deck-pop-ease: cubic-bezier(0.34, 1.8, 0.5, 1);

    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .deck-search {
    box-sizing: border-box;
    height: var(--deck-height);

    border-radius: var(--border-radius-pill);
    background:
      var(--background-navbar-entry),
      color-mix(in srgb, var(--color-background-navbar) 75%, transparent);
    backdrop-filter: blur(var(--ni-8));
    box-shadow: var(--shadow-navbar-entry);
  }

  .deck-search {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    width: var(--ni-320);
    min-width: 0;
    padding-inline: var(--ni-14) var(--ni-4);

    animation: deck-search-in var(--deck-slide-duration) var(--deck-slide-ease)
      both;
    transition:
      box-shadow var(--transition-increment) ease-in-out,
      opacity calc(2 * var(--transition-increment)) ease-in-out,
      width var(--deck-slide-duration) var(--deck-slide-ease),
      flex-basis var(--deck-slide-duration) var(--deck-slide-ease),
      padding var(--deck-slide-duration) var(--deck-slide-ease),
      margin var(--deck-slide-duration) var(--deck-slide-ease);

    &:focus-within {
      box-shadow: var(--shadow-navbar-entry-hover);
    }
  }

  .deck-search-field {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    min-width: 0;
    height: 100%;
    cursor: text;

    :global(svg) {
      flex: none;
      width: var(--ni-18);
      height: var(--ni-18);
      color: var(--color-text-secondary);
    }

    input {
      all: unset;
      flex: 1;
      min-width: 0;
      height: 100%;

      color: var(--color-text-primary);
      font-size: var(--font-size-text);

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }

  .deck-search-type {
    --segmented-select-segment-height: var(--ni-24);

    flex: none;
  }

  .deck-slots {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--deck-slot-gap);

    height: var(--deck-slot-height);
    overflow: hidden;

    animation: deck-slots-in var(--deck-slide-duration) var(--deck-slide-ease)
      calc(var(--transition-increment) / 2) both;
    transition:
      gap calc(2 * var(--transition-increment)) var(--deck-slide-ease),
      box-shadow calc(2 * var(--transition-increment)) ease-in-out;
  }

  .deck-shine {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 60%;

    background: linear-gradient(
      100deg,
      transparent,
      color-mix(in srgb, var(--shade-10) 16%, transparent),
      transparent
    );
    transform: translateX(calc(var(--rtl-sign, 1) * -120%));
    pointer-events: none;
  }

  .deck-slot {
    position: relative;
    flex: none;
    display: grid;
    place-items: center;

    width: var(--deck-slot-width);
    height: var(--deck-slot-height);

    border-radius: var(--deck-slot-radius);
    overflow: hidden;
    background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 14%, transparent);

    transition: box-shadow calc(2 * var(--transition-increment)) ease-in-out;

    &[data-filled="true"] {
      box-shadow: 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--color-foreground) 14%, transparent);
    }

    &[data-flash="true"] {
      box-shadow:
        0 0 0 var(--border-thickness-xs) var(--color-text-primary),
        0 0 var(--ni-16)
          color-mix(in srgb, var(--color-text-primary) 45%, transparent);
    }

    :global(.trakt-link) {
      display: block;
      width: 100%;
      height: 100%;
      text-decoration: none;
    }

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;

      transition:
        transform calc(3 * var(--transition-increment)) var(--deck-pop-ease),
        opacity var(--transition-increment) ease-in-out;
    }

    &[data-landing="true"] :global(img) {
      opacity: 0;
      transform: scale(0.6);
      transition: none;
    }
  }

  .deck-slot[data-add="true"] {
    background: color-mix(in srgb, var(--color-foreground) 2%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xs)
      color-mix(in srgb, var(--purple-400) 60%, transparent);
  }

  .deck-slot-add {
    display: flex;
    color: var(--purple-300);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .trakt-mixtape-navbar-deck[data-full="true"] .deck-slots {
    gap: var(--ni-3);
  }

  .trakt-mixtape-navbar-deck[data-view="results"] {
    --deck-slot-width: var(--ni-22);
    --deck-slot-height: var(--ni-32);
    --deck-slot-radius: var(--ni-4);

    /* The picks pill is barely there: a 3% wash and a hairline, no glass. */
    .deck-slots {
      box-sizing: border-box;
      height: var(--deck-height);
      padding-inline: var(--ni-10);

      border-radius: var(--border-radius-pill);
      background: color-mix(in srgb, var(--color-foreground) 3%, transparent);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }
  }

  .trakt-mixtape-navbar-deck[data-shine="true"] .deck-shine {
    transform: translateX(calc(var(--rtl-sign, 1) * 300%));
    transition: transform calc(6 * var(--transition-increment))
      cubic-bezier(0.3, 0.7, 0.2, 1) calc(0.8 * var(--transition-increment));
  }

  /*
    Results: the search folds away and the loaded deck becomes the picks
    pill, with a Change tail that leads back into the picker.
  */
  .trakt-mixtape-navbar-deck[data-view="results"] .deck-search {
    flex: 0 0 0;
    width: 0;
    min-width: 0;
    padding-inline: 0;
    margin-inline-end: calc(-1 * var(--gap-xs));
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }

  .deck-change {
    flex: none;
    display: flex;
    align-items: center;
    margin-inline-start: var(--ni-4);

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--ni-6);
      height: var(--ni-28);
      padding-inline: var(--ni-10);

      border-radius: var(--border-radius-pill);
      background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
      color: var(--color-text-secondary);
      font-size: var(--font-size-text-small);
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;

      transition:
        background var(--transition-increment) ease-in-out,
        color var(--transition-increment) ease-in-out;
    }

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    @include for-mouse {
      :global(.trakt-link:hover),
      :global(.trakt-link:focus-visible) {
        background: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
        color: var(--color-text-primary);
      }
    }
  }

  /*
    Docked: the phone keeps the search at the top and floats the deck above
    the bottom navbar, where the thumbs are. Once the deck is full the tray
    grows a Mix it row, so the payoff sits under the thumb as well.
  */
  .trakt-mixtape-navbar-deck[data-layout="docked"] {
    --deck-slot-width: var(--ni-28);
    --deck-slot-height: var(--ni-42);
    --deck-slot-radius: var(--ni-6);
    --deck-slots-from: translateY(var(--ni-24));

    width: 100%;

    .deck-search {
      flex: 1;
      width: auto;
    }

    .deck-tray {
      position: fixed;
      inset-inline: 0;
      inset-block-end: calc(var(--mobile-navbar-height) + var(--gap-s));
      z-index: var(--layer-floating);

      display: grid;
      grid-template-rows: auto 0fr;
      box-sizing: border-box;
      width: fit-content;
      margin-inline: auto;
      padding: var(--gap-xs) var(--ni-12);

      border-radius: var(--border-radius-xxl);
      background:
        var(--background-navbar-entry),
        color-mix(in srgb, var(--color-background-navbar) 85%, transparent);
      backdrop-filter: blur(var(--ni-8));
      box-shadow: var(--shadow-navbar-entry), var(--shadow-floating);

      animation: deck-slots-in var(--deck-slide-duration) var(--deck-slide-ease)
        calc(var(--transition-increment) / 2) both;
      transition:
        grid-template-rows calc(3 * var(--transition-increment))
          var(--deck-slide-ease),
        box-shadow calc(2 * var(--transition-increment)) ease-in-out;

      &[data-ready="true"] {
        grid-template-rows: auto 1fr;
      }
    }

    .deck-slots {
      height: var(--deck-slot-height);
      padding-inline: 0;

      background: none;
      backdrop-filter: none;
      box-shadow: none;

      animation: none;
      transition: gap calc(2 * var(--transition-increment))
        var(--deck-slide-ease);
    }

    .deck-mix {
      min-height: 0;
      overflow: hidden;
    }

    .deck-mix-inner {
      display: grid;
      padding-block-start: var(--gap-xs);

      :global(.trakt-button) {
        width: 100%;
      }
    }

    &[data-full="true"] .deck-slots {
      box-shadow: none;
    }

    &[data-full="true"] .deck-tray {
      box-shadow: var(--shadow-mixtape-deck-loaded), var(--shadow-floating);
    }

    /*
      Results on small screens: the tray leaves the bottom of the screen
      and sits in the sticky bar as the picks pill.
    */
    &[data-view="results"] {
      --deck-slot-width: var(--ni-22);
      --deck-slot-height: var(--ni-32);
      --deck-slot-radius: var(--ni-4);

      justify-content: center;

      .deck-search {
        flex: 0 0 0;
        width: 0;
        padding-inline: 0;
      }

      .deck-tray {
        position: static;
        width: auto;
        margin: 0;
        padding: 0;

        background: none;
        backdrop-filter: none;
        box-shadow: none;
        animation: none;
      }

      .deck-slots {
        justify-content: flex-start;
      }
    }

    /*
      Phones: the tray spans the screen inside the page gutter and the
      slots grow to a real thumb target, spread edge to edge.
    */
    @include for-mobile {
      --deck-slot-width: var(--ni-48);
      --deck-slot-height: var(--ni-72);
      --deck-slot-radius: var(--ni-8);

      .deck-tray {
        inset-inline: var(--layout-distance-side);
        width: auto;
        margin-inline: 0;
        padding-inline: var(--ni-16);
      }

      .deck-slots {
        justify-content: center;
        gap: var(--gap-s);
      }

      .deck-search {
        padding-inline-start: var(--ni-12);
      }

      .deck-search-field {
        gap: var(--ni-6);
      }
    }
  }

  .deck-tray {
    display: contents;
  }

  @keyframes deck-search-in {
    from {
      opacity: 0;
      transform: translateX(var(--deck-slide-distance));
    }
  }

  @keyframes deck-slots-in {
    from {
      opacity: 0;
      transform: var(--deck-slots-from);
    }
  }
</style>
