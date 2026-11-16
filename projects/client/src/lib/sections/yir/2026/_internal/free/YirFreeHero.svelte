<script lang="ts">
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { onMount } from "svelte";
  import { yirBeats } from "../persona/yirBeats";
  import YirCountUp from "../scenes/YirCountUp.svelte";
  import type { YirFreeHeroProps } from "./YirFreeHeroProps";

  const DECK_SIZE = 3;

  const { watched, name, avatarUrl, joinedAt, year }: YirFreeHeroProps =
    $props();

  let isMounted = $state(false);
  onMount(() => {
    isMounted = true;
  });

  const deck = $derived(watched?.titles.slice(0, DECK_SIZE) ?? []);

  const totals = $derived(
    watched
      ? [
          {
            key: "plays",
            value: watched.plays,
            label: m.month_review_label_plays(),
          },
          {
            key: "titles",
            value: watched.movies + watched.shows,
            label: m.month_review_label_titles(),
          },
          {
            key: "days",
            value: watched.activeDays ?? 0,
            label: m.month_review_label_active_days(),
          },
        ]
      : [],
  );
</script>

<section class="trakt-yir-free-hero" id="section-totals">
  <div class="yir-free-hero-inner">
    <div class="yir-free-hero-card">
      <div class="yir-free-hero-brand">
        <CircularLogo />
        <span>{m.yir_title_year_in_review()}</span>
      </div>
      {#if deck.length > 0}
        <div class="yir-free-hero-deck" aria-hidden="true">
          {#each deck as title (title.key)}
            <img src={title.poster} alt="" />
          {/each}
        </div>
      {/if}
      <div class="yir-free-hero-stub">
        <div class="yir-free-hero-stub-text">
          <span class="yir-free-hero-year">{year}</span>
          {#if joinedAt}
            <span class="yir-free-hero-since">
              {m.yir_free_member_since({ year: joinedAt.getFullYear() })}
            </span>
          {/if}
        </div>
        <div class="yir-free-hero-barcode" aria-hidden="true"></div>
      </div>
    </div>

    <div class="yir-free-hero-copy">
      <span class="yir-free-hero-kicker">{m.yir_free_kicker()}</span>
      <h1 class="yir-free-hero-name">
        <img class="yir-free-hero-avatar" src={avatarUrl} alt="" />
        <span>{name}</span>
      </h1>
      <p class="yir-free-hero-tagline">{m.yir_free_tagline({ year })}</p>

      <dl class="yir-free-hero-totals">
        {#each totals as total (total.key)}
          <div>
            <dt>{total.label}</dt>
            <dd>
              <YirCountUp
                value={total.value}
                active={isMounted}
                format={(value) => formatNumber(Math.round(value))}
                duration={yirBeats(18)}
              />
            </dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-free-hero {
    width: 100%;
    background:
      radial-gradient(
        70% 90% at 15% 0%,
        color-mix(in srgb, var(--color-yir-accent) 18%, transparent),
        transparent 70%
      ),
      var(--color-yir-background);
  }

  .yir-free-hero-inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: var(--ni-32);
    box-sizing: border-box;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: calc(var(--ni-104) + env(safe-area-inset-top, 0px)) var(--ni-24)
      var(--ni-72);

    @include for-tablet-lg {
      grid-template-columns: minmax(0, var(--ni-300)) minmax(0, 1fr);
      justify-items: start;
      align-items: center;
      gap: var(--ni-48);
      padding-inline: var(--ni-48);
    }

    @include for-desktop {
      grid-template-columns: minmax(0, var(--ni-340)) minmax(0, 1fr);
      justify-items: start;
      align-items: center;
      gap: var(--ni-72);
      padding-inline: var(--ni-72);
    }
  }

  .yir-free-hero-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--ni-16);
    width: min(100%, var(--ni-300));
    aspect-ratio: 3 / 4;
    box-sizing: border-box;
    padding: var(--ni-24);
    border-radius: var(--border-radius-xl);
    background:
      radial-gradient(
        80% 55% at 50% 38%,
        color-mix(in srgb, var(--color-yir-accent) 22%, transparent),
        transparent 70%
      ),
      var(--color-yir-surface-raised);
    box-shadow:
      inset 0 0 0 var(--ni-1)
        color-mix(in srgb, var(--color-yir-accent) 35%, transparent),
      var(--shadow-floating);
  }

  .yir-free-hero-deck {
    position: relative;
    flex: 1;
    min-height: var(--ni-120);

    img {
      position: absolute;
      top: 0;
      left: 50%;
      width: 34%;
      aspect-ratio: 2 / 3;
      border-radius: var(--border-radius-s);
      object-fit: cover;
      background: var(--color-yir-surface-chip);
      box-shadow: var(--shadow-floating);
      translate: -50% 0;

      &:nth-child(1) {
        rotate: -9deg;
        translate: -120% var(--ni-8);
      }

      &:nth-child(2) {
        z-index: 1;
      }

      &:nth-child(3) {
        rotate: 9deg;
        translate: 20% var(--ni-8);
      }
    }
  }

  .yir-free-hero-brand {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    color: var(--color-yir-accent);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .yir-free-hero-stub {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--ni-12);
    padding-top: var(--ni-16);
    border-top: var(--ni-2) dashed var(--color-yir-separator);

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: calc(-1 * var(--ni-12));
      width: var(--ni-24);
      height: var(--ni-24);
      border-radius: 50%;
      background: var(--color-yir-background);
    }

    &::before {
      inset-inline-start: calc(-1 * var(--ni-36));
    }

    &::after {
      inset-inline-end: calc(-1 * var(--ni-36));
    }
  }

  .yir-free-hero-stub-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .yir-free-hero-barcode {
    flex-shrink: 0;
    width: var(--ni-48);
    height: var(--ni-40);
    opacity: 0.5;
    background: repeating-linear-gradient(
      90deg,
      var(--color-yir-text-muted) 0 var(--ni-2),
      transparent var(--ni-2) var(--ni-4),
      var(--color-yir-text-muted) var(--ni-4) var(--ni-6),
      transparent var(--ni-6) var(--ni-10)
    );
  }

  .yir-free-hero-year {
    font-family: var(--yir-font-display);
    font-size: var(--ni-64);
    font-weight: 700;
    line-height: 0.9;
    letter-spacing: -0.03em;
    color: var(--color-yir-accent);
  }

  .yir-free-hero-brand span,
  .yir-free-hero-since,
  .yir-free-hero-kicker,
  .yir-free-hero-totals dt {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-yir-text-muted);
  }

  .yir-free-hero-copy {
    container-type: inline-size;
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--ni-12);

    @include for-tablet-lg {
      align-items: flex-start;
      text-align: start;
    }

    @include for-desktop {
      align-items: flex-start;
      text-align: start;
    }
  }

  .yir-free-hero-name {
    display: flex;
    align-items: center;
    gap: 0.2em;
    max-width: 100%;
    margin: 0;
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-32), 11cqi, var(--ni-104));
    line-height: 0.95;
    letter-spacing: -0.03em;
    overflow-wrap: break-word;

    span {
      min-width: 0;
      font-size: inherit;
    }
  }

  .yir-free-hero-avatar {
    flex-shrink: 0;
    width: 0.8em;
    height: 0.8em;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 0 var(--ni-2)
      color-mix(in srgb, var(--color-yir-accent) 35%, transparent);
  }

  .yir-free-hero-tagline {
    margin: 0;
    font-size: var(--font-size-title);
    color: var(--color-yir-text-secondary);
  }

  .yir-free-hero-totals {
    display: flex;
    flex-wrap: wrap;
    justify-content: inherit;
    gap: var(--ni-24);
    margin: var(--ni-8) 0 0;

    div {
      display: flex;
      flex-direction: column-reverse;
    }

    dd {
      margin: 0;
      font-family: var(--yir-font-display);
      font-size: clamp(var(--ni-40), 9cqi, var(--ni-80));
      font-weight: 700;
      line-height: 1;
      color: var(--color-yir-accent);
      font-variant-numeric: tabular-nums;
    }
  }
</style>
