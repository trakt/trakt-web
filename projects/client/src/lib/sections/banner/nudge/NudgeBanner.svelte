<script lang="ts">
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import CrownIcon from "$lib/components/icons/CrownIcon.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useVipUpsell } from "$lib/features/upsell/useVipUpsell.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { markNudgeSeenRequest } from "$lib/requests/vip/markNudgeSeenRequest.ts";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { Action } from "svelte/action";
  import BannerContainer from "../_internal/BannerContainer.svelte";
  import BannerCta from "../_internal/BannerCta.svelte";
  import { toNudgeCopy } from "./_internal/toNudgeCopy.ts";
  import { useNudgeCard } from "./_internal/useNudgeCard.ts";

  const { card, hide } = useNudgeCard();
  const { trackClick, trackImpression } = useVipUpsell(() => "home-nudge");

  const format = (value: number) => toGroupedNumber(value, languageTag());

  const reportSeen: Action = () => {
    markNudgeSeenRequest().catch(() => undefined);
  };
</script>

{#snippet detail(text: string)}
  <p class="small secondary nudge-detail">{text}</p>
{/snippet}

{#if $card}
  {@const copy = toNudgeCopy({ card: $card, format })}
  <BannerContainer variant="fluid">
    <section class="trakt-nudge-card" use:trackImpression use:reportSeen>
      <span class="nudge-mark" aria-hidden="true">
        <CrownIcon />
      </span>

      <div class="nudge-text">
        <p class="bold nudge-title">{copy.title}</p>

        {#if $card.kind === "limit"}
          <div class="nudge-usage">
            <span class="nudge-meter">
              <span class="nudge-track" aria-hidden="true">
                <span class="nudge-fill" style:--nudge-fill={$card.meter.fill}>
                  {#if $card.meter.base > 0}
                    <span
                      class="nudge-segment"
                      class:is-soft={$card.meter.over > 0}
                      style:--segment-weight={$card.meter.base}
                    ></span>
                  {/if}
                  {#if $card.meter.over > 0}
                    <span
                      class="nudge-segment"
                      style:--segment-weight={$card.meter.over}
                    ></span>
                  {/if}
                </span>
              </span>
              <span class="small secondary nudge-count">
                <span class="bold nudge-count-used">{format($card.used)}</span>
                / {format($card.total)}
              </span>
            </span>
            {@render detail(copy.detail)}
          </div>
        {:else}
          <RenderFor
            audience="all"
            device={["tablet-sm", "tablet-lg", "desktop"]}
          >
            {@render detail(copy.detail)}
          </RenderFor>
          <RenderFor audience="all" device={["mobile"]}>
            {@render detail(copy.shortDetail)}
          </RenderFor>
        {/if}
      </div>

      <div class="nudge-cta">
        <BannerCta
          href={UrlBuilder.vip("home-nudge")}
          label={m.vip_nudge_action()}
          onclick={trackClick}
        >
          {m.vip_nudge_action()}
        </BannerCta>
      </div>

      <button
        type="button"
        class="nudge-close"
        aria-label={m.vip_nudge_close()}
        onclick={hide}
      >
        <CloseIcon />
      </button>
    </section>
  </BannerContainer>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-nudge-card {
    position: relative;

    display: flex;
    align-items: center;
    gap: var(--ni-14);

    width: 100%;
    min-height: calc(var(--ni-64) + var(--ni-4));
    box-sizing: border-box;

    padding-block: var(--ni-10);
    padding-inline-start: var(--gap-m);
    padding-inline-end: var(--ni-4);

    background: var(--color-card-background);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);
    border-radius: var(--border-radius-m);

    @include for-mobile {
      display: grid;
      grid-template-columns: var(--ni-22) 1fr;
      align-items: start;
      column-gap: var(--gap-s);

      padding: var(--gap-s);
    }
  }

  .nudge-mark {
    display: inline-flex;
    flex-shrink: 0;

    color: var(--color-accent-purple);

    :global(svg) {
      width: var(--ni-22);
      height: var(--ni-22);
    }
  }

  .nudge-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);

    flex: 1 1 auto;
    min-width: 0;

    @include for-mobile {
      gap: var(--gap-xs);
      padding-inline-end: calc(var(--ni-32) + var(--ni-2));
    }
  }

  .nudge-title {
    line-height: 1.3;
  }

  .nudge-detail {
    line-height: 1.35;
  }

  .nudge-usage {
    display: flex;
    align-items: center;
    gap: var(--ni-14);
    min-width: 0;

    @include for-mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-xs);
    }
  }

  .nudge-meter {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: var(--ni-10);
  }

  .nudge-track {
    display: block;
    overflow: hidden;

    width: var(--ni-120);
    height: var(--ni-4);

    background: var(--color-border);
    border-radius: var(--ni-2);

    @include for-mobile {
      width: var(--ni-152);
    }
  }

  .nudge-fill {
    display: flex;
    gap: var(--ni-2);

    width: calc(var(--nudge-fill) * 100%);
    height: 100%;
  }

  .nudge-segment {
    display: block;
    flex: var(--segment-weight) 1 0;
    height: 100%;

    background: var(--color-usage-bar);
    border-radius: var(--ni-2);

    &.is-soft {
      background: color-mix(in srgb, var(--color-usage-bar) 55%, transparent);
    }
  }

  .nudge-count {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .nudge-count-used {
    color: var(--color-foreground);
  }

  .nudge-cta {
    display: flex;
    flex-shrink: 0;

    @include for-mobile {
      grid-column: 2;
      justify-self: start;
      margin-block-start: var(--ni-2);
    }
  }

  .nudge-close {
    all: unset;
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: var(--ni-44);
    height: var(--ni-44);

    color: var(--color-text-secondary);
    border-radius: var(--border-radius-pill);
    cursor: pointer;

    transition: color var(--transition-increment) ease;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-accent-purple);
      outline-offset: var(--ni-2);
    }

    @include for-mouse {
      &:hover {
        color: var(--color-foreground);
      }
    }

    @include for-mobile {
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
    }
  }

  @keyframes nudge-enter {
    from {
      opacity: 0;
      transform: translateY(calc(var(--ni-8) * -1));
    }
  }

  @keyframes nudge-meter-fill {
    from {
      clip-path: inset(0 100% 0 0);
    }
  }

  @keyframes nudge-meter-fill-rtl {
    from {
      clip-path: inset(0 0 0 100%);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .trakt-nudge-card {
      animation: nudge-enter var(--transition-duration-short) ease-out both;
    }

    .nudge-fill {
      animation: nudge-meter-fill 700ms cubic-bezier(0.2, 0.7, 0.2, 1) 120ms
        both;

      &:dir(rtl) {
        animation-name: nudge-meter-fill-rtl;
      }
    }
  }
</style>
