<script lang="ts">
  import VipUpsellBadge from "$lib/components/badge/VipUpsellBadge.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { useVipUpsell } from "$lib/features/upsell/useVipUpsell.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DirectorCard from "./DirectorCard.svelte";
  import { useReviewDirectors } from "./useReviewDirectors.ts";

  const {
    year,
    month,
    monthName,
  }: {
    year: number;
    month: number;
    monthName: string;
  } = $props();

  const directors = useReviewDirectors();
  const { trackClick, trackImpression } = useVipUpsell(() => "mir");

  const features = [
    m.month_review_feature_hours,
    m.month_review_feature_nights,
    m.month_review_services,
    m.yir_label_top_genres,
    m.month_review_feature_top_rated,
    m.month_review_feature_recap,
  ];
</script>

<div class="trakt-month-review-vip-panel" use:trackImpression>
  <div class="pitch">
    <VipUpsellBadge />
    <h2>{m.month_review_more_title({ month: monthName })}</h2>
    <p>{m.month_review_more_body()}</p>
    <ul class="features">
      {#each features as feature (feature)}
        <li>
          <span class="check"><CheckIcon /></span><span class="bold"
            >{feature()}</span
          >
        </li>
      {/each}
    </ul>
    <div class="cta">
      <Button
        href={UrlBuilder.vip("mir")}
        label={m.month_review_unlock()}
        color="purple"
        onclick={trackClick}
      >
        {m.month_review_unlock()}
      </Button>
      <span class="note bold">{m.month_review_includes_yir()}</span>
    </div>
  </div>

  {#if $directors.length > 0}
    <div class="proof">
      <div class="proof-head">
        <span class="kicker bold">{m.month_review_see_it()}</span>
        <span class="sub"
          >{m.month_review_see_it_body({ month: monthName })}</span
        >
      </div>
      <div class="fan">
        {#each $directors as director (director.username)}
          <div class="slot">
            <DirectorCard {director} {year} {month} {monthName} />
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-vip-panel {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: center;
    gap: var(--ni-48);
    padding: var(--ni-56);
    border-radius: var(--border-radius-xxl);
    background:
      radial-gradient(
        55% 75% at 0% 0%,
        var(--color-month-review-panel-glow),
        transparent 70%
      ),
      radial-gradient(
        45% 60% at 100% 100%,
        var(--color-month-review-glow),
        transparent 70%
      ),
      var(--color-month-review-panel);
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--color-month-review-accent) 40%, transparent);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      padding: var(--ni-32) var(--gap-l);
      gap: var(--ni-32);
    }
  }

  .pitch {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-m);
    min-width: 0;

    h2 {
      margin: 0;
      font-size: clamp(var(--ni-36), 4.6vw, var(--ni-64));
      letter-spacing: -0.045em;
      line-height: 0.95;
      text-wrap: balance;
    }

    p {
      margin: 0;
      max-width: 46ch;
      font-size: var(--font-size-title);
      color: var(--color-text-secondary);
    }
  }

  .features {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-s) var(--gap-l);
    width: 100%;
    max-width: var(--ni-480);

    li {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }
  }

  .check {
    display: grid;
    place-items: center;
    flex: none;
    width: var(--ni-20);
    height: var(--ni-20);
    border-radius: 50%;
    color: var(--color-month-review-accent);
    background: color-mix(
      in srgb,
      var(--color-month-review-accent) 14%,
      transparent
    );

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }

  .cta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-m);
    margin-top: var(--gap-xs);
  }

  .note,
  .kicker {
    font-size: var(--font-size-text-small);
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-month-review-accent);
  }

  .proof {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    min-width: 0;
  }

  .proof-head {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    text-align: center;
  }

  .sub {
    color: var(--color-text-secondary);
  }

  .fan {
    position: relative;
    height: var(--ni-380);
    container-type: inline-size;

    @include for-mobile {
      height: var(--ni-300);
    }
  }

  .slot {
    --x: 0%;
    --y: 0%;
    --tilt: 0deg;
    --scale: 1;

    position: absolute;
    left: 50%;
    top: 50%;
    width: min(42%, var(--ni-220));
    transform: translate(-50%, -50%)
      translate(calc(var(--rtl-sign) * var(--x)), var(--y))
      rotate(calc(var(--rtl-sign) * var(--tilt))) scale(var(--scale));
    transition:
      transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 300ms ease;

    &:nth-child(1) {
      --x: -76%;
      --y: 7%;
      --tilt: -10deg;
      --scale: 0.9;
    }

    &:nth-child(2) {
      --y: -3%;
      z-index: 2;
    }

    &:nth-child(3) {
      --x: 76%;
      --y: 7%;
      --tilt: 10deg;
      --scale: 0.9;
      z-index: 1;
    }

    &:hover,
    &:focus-within {
      --y: -9%;
      --tilt: 0deg;
      --scale: 1;

      z-index: 3;
    }
  }

  .fan:hover .slot:not(:hover) {
    opacity: 0.55;
  }

  @media (prefers-reduced-motion: reduce) {
    .slot {
      transition: none;
    }
  }
</style>
