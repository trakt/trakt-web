<script lang="ts">
  import { getIntlLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate.ts";
  import type { VipCancelLoss } from "../models/VipCancelLoss.ts";
  import type { LossRowsProps } from "./LossRowsProps.ts";

  type LossRow = { key: string; title: string; detail: string; value: string };

  const MAX_ROWS = 4;

  const { losses, endsAt, isActive }: LossRowsProps = $props();

  const toList = (items: ReadonlyArray<string>) =>
    new Intl.ListFormat(getIntlLocale(languageTag()), {
      type: "conjunction",
    }).format(items);

  const toRow = (loss: VipCancelLoss): LossRow => {
    switch (loss.kind) {
      case "streaming":
        return {
          key: loss.kind,
          title: toList(loss.services),
          detail: m.text_vip_cancel_loss_streaming(),
          value:
            loss.services.length === 1
              ? m.text_vip_cancel_value_service()
              : m.text_vip_cancel_value_services({
                  count: loss.services.length,
                }),
        };
      case "plex-scrobbling":
        return {
          key: loss.kind,
          title: m.header_vip_cancel_loss_plex_scrobbling(),
          detail: m.text_vip_cancel_loss_plex_scrobbling(),
          value: m.text_vip_cancel_value_off(),
        };
      case "plex-servers":
        return {
          key: loss.kind,
          title: m.header_vip_cancel_loss_plex_servers(),
          detail: m.text_vip_cancel_loss_plex_servers(),
          value:
            loss.count === 1
              ? m.text_vip_cancel_value_server()
              : m.text_vip_cancel_value_servers({ count: loss.count }),
        };
    }
  };

  const FEATURES = [
    { key: "reviews", title: () => m.text_vip_cancel_feature_reviews() },
    { key: "insights", title: () => m.text_vip_cancel_feature_insights() },
    { key: "plex", title: () => m.text_vip_cancel_feature_plex() },
    { key: "streaming", title: () => m.text_vip_cancel_feature_streaming() },
  ];

  const rows = $derived(
    losses.length > 0
      ? losses.slice(0, MAX_ROWS).map(toRow)
      : FEATURES.map(({ key, title }) => ({
          key,
          title: title(),
          detail: "",
          value: "",
        })),
  );

  const heading = $derived(
    losses.length > 0
      ? m.header_vip_cancel_losses({
          date: toHumanShortDate(endsAt, languageTag()),
        })
      : m.header_vip_cancel_includes(),
  );
</script>

<section class="trakt-vip-cancel-loss-rows" class:is-active={isActive}>
  <h2 class="loss-heading small bold">{heading}</h2>
  <ul class="loss-list">
    {#each rows as row, index (row.key)}
      <li class="loss-row" style="--row-index: {index}">
        <span class="loss-copy">
          <span class="loss-title bold">{row.title}</span>
          {#if row.detail}
            <span class="loss-detail small">{row.detail}</span>
          {/if}
        </span>
        {#if row.value}
          <span class="loss-value bold">{row.value}</span>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-cancel-loss-rows {
    display: grid;
    gap: var(--gap-s);
  }

  .loss-heading {
    margin: 0;
    color: var(--deck-card-muted);
  }

  .loss-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .loss-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: baseline;
    gap: var(--gap-m);
    padding-block: var(--ni-12);
    border-block-start: var(--ni-1) solid var(--deck-card-line);

    .is-active & {
      animation: loss-row-in 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
      animation-delay: calc(350ms + var(--row-index) * 70ms);
    }

    @container vip-cancel (max-width: 760px) {
      padding-block: var(--ni-8);

      &:nth-child(n + 4) {
        display: none;
      }
    }
  }

  .loss-copy {
    display: grid;
    gap: var(--gap-xxs);
    min-width: 0;
  }

  .loss-title {
    font-size: var(--ni-18);

    @container vip-cancel (max-width: 760px) {
      font-size: var(--ni-14);
    }
  }

  .loss-detail {
    color: var(--deck-card-muted);
  }

  .loss-value {
    font-size: var(--ni-20);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;

    @container vip-cancel (max-width: 760px) {
      font-size: var(--ni-14);
    }
  }

  @keyframes loss-row-in {
    from {
      opacity: 0;
      transform: translateY(var(--ni-10));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .is-active .loss-row {
      animation: none;
    }
  }
</style>
