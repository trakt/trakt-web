<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { languageTag } from "$lib/features/i18n";
  import type { YirCountriesGroup } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName";
  import YirCountriesMap from "../../../_internal/YirCountriesMap.svelte";
  import YirTooltip from "../../../_internal/YirTooltip.svelte";
  import { yirMediaUnit } from "../../../_internal/yirMediaUnit";
  import YirCountUp from "./YirCountUp.svelte";
  import YirRankBars from "./YirRankBars.svelte";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    type,
    group,
  }: {
    id: string;
    index: number;
    type: "shows" | "movies";
    group: YirCountriesGroup;
  } = $props();

  const name = (code: string) => toCountryName(code, languageTag());
  const unit = (count: number) => `${formatNumber(count)} ${yirMediaUnit(type, count)}`;
  const sorted = $derived([...group.countries].sort((a, b) => b.count - a.count));
  const rows = $derived(
    sorted.slice(0, 5).map((country) => ({
      key: country.code,
      name: name(country.code),
      value: country.count,
      detail: unit(country.count),
    })),
  );

  let isHovering = $state(false);
</script>

<YirScene
  {id}
  {index}
  kicker={type === "shows"
    ? m.yir_section_title_show_countries()
    : m.yir_section_title_movie_countries()}
  title={type === "shows"
    ? m.yir_2024_most_watched_show_countries()
    : m.yir_2024_most_watched_movie_countries()}
>
  {#snippet children(isInView)}
    <div
      class="yir-map"
      role="presentation"
      class:is-in={isInView}
      class:is-hovering={isHovering}
      data-reveal
      style:--d="calc(var(--yir-beat) * 2)"
      onpointerover={(event) => {
        isHovering =
          event.pointerType === "mouse" &&
          event.target instanceof Element &&
          event.target.classList.contains("is-interactive");
      }}
      onpointerleave={() => (isHovering = false)}
    >
      <div class="yir-map-grid" aria-hidden="true"></div>
      <div class="yir-map-scan" aria-hidden="true"></div>
      <YirCountriesMap
        countries={[...group.countries]}
        highlight="var(--color-yir-accent)"
      >
        {#snippet tooltip({ country })}
          <YirTooltip main={name(country.code)} sub={unit(country.count)} />
        {/snippet}
      </YirCountriesMap>
    </div>

    <div class="yir-countries">
      <div class="yir-countries-count" data-reveal>
        <b>
          <YirCountUp
            value={group.countryCount}
            active={isInView}
            format={(value) => formatNumber(Math.round(value))}
          />
        </b>
        <span>{m.yir_2024_country_count()}</span>
      </div>
      <YirRankBars {rows} active={isInView} />
    </div>
  {/snippet}
</YirScene>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-map {
    --color-map-chart-highlight: var(--color-yir-accent);
    --color-map-chart-background: color-mix(
      in srgb,
      var(--color-yir-accent) 30%,
      var(--color-yir-background)
    );
    --color-map-chart-missing: color-mix(
      in srgb,
      var(--color-yir-text-primary) 9%,
      var(--color-yir-background)
    );
    --color-map-chart-border: var(--color-yir-background);

    position: relative;
    width: 100%;
    aspect-ratio: 2.26;
    padding: clamp(var(--ni-12), 3%, var(--ni-40));
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    background: radial-gradient(
      50% 50% at 50% 50%,
      color-mix(in srgb, var(--color-yir-accent) 9%, transparent),
      transparent 100%
    );

    > :global(*:not(.yir-map-grid, .yir-map-scan)) {
      position: relative;
      height: 100%;
    }

    :global(.trakt-country-map svg) {
      overflow: visible;
    }

    :global(.trakt-country-map) {
      clip-path: inset(-20% 100% -20% -20%);
      transition: clip-path calc(var(--yir-beat) * 18) cubic-bezier(0.65, 0, 0.35, 1) calc(var(--yir-beat) * 3);
    }

    :global(.country) {
      transition:
        filter var(--yir-t-quick) ease,
        opacity var(--yir-t-quick) ease;
    }

    :global(.country.is-interactive) {
      filter: drop-shadow(
        0 0 var(--ni-10)
          color-mix(in srgb, var(--color-yir-accent) 80%, transparent)
      );
    }

    &.is-in :global(.trakt-country-map) {
      clip-path: inset(-20%);
    }

  }

  .yir-map-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-yir-text-primary) 14%, transparent) 0.06rem,
      transparent 0.07rem
    );
    background-size: var(--ni-16) var(--ni-16);
    mask-image: radial-gradient(50% 50% at 50% 50%, black 30%, transparent 100%);
  }

  .yir-map-scan {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 12%;
    z-index: var(--layer-raised);
    pointer-events: none;
    background: linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--color-yir-accent) 35%, transparent),
      transparent
    );
    opacity: 0;
    translate: -100% 0;
  }

  .is-in .yir-map-scan {
    animation: map-scan calc(var(--yir-beat) * 18) cubic-bezier(0.65, 0, 0.35, 1) calc(var(--yir-beat) * 3) both;
  }

  @include for-mouse {
    .yir-map.is-hovering :global(.country:not(:hover)) {
      opacity: 0.55;
    }
  }

  @keyframes map-scan {
    0% {
      opacity: 1;
      translate: -100% 0;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      translate: 900% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-map :global(.trakt-country-map) {
      clip-path: none;
      transition: none;
    }

    .is-in .yir-map-scan {
      animation: none;
    }
  }


  .yir-countries {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-48);

    @include for-desktop {
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    }
  }

  .yir-countries-count {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    b {
      font-family: var(--yir-font-display);
      font-weight: 400;
      font-size: clamp(var(--ni-96), 16vw, var(--ni-200));
      line-height: 0.85;
      color: var(--color-yir-accent);
    }

    span {
      font-family: var(--yir-font-mono);
      font-size: var(--font-size-tag);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-yir-text-muted);
    }
  }
</style>
