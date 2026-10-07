<script lang="ts">
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber.ts";
  import type { VipCancelLimit } from "../models/VipCancelLimit.ts";
  import DeckCard from "./DeckCard.svelte";
  import DeckCardHeading from "./DeckCardHeading.svelte";
  import UsageLimitItem from "../../../UsageLimitItem.svelte";
  import type { LibraryCardProps } from "./LibraryCardProps.ts";
  import VipCancelButton from "./VipCancelButton.svelte";

  const { position, total, summary, onContinue, onKeep }: LibraryCardProps =
    $props();

  const LABELS: Record<VipCancelLimit["item"], () => string> = {
    watchlist: () => m.text_vip_cancel_limit_watchlist(),
    collection: () => m.text_vip_cancel_limit_collection(),
    notes: () => m.text_vip_cancel_limit_notes(),
    "smart-lists": () => m.text_vip_cancel_limit_smart_lists(),
    "connected-apps": () => m.text_vip_cancel_limit_connected_apps(),
  };

  const format = (value: number) => toGroupedNumber(value, languageTag());
  const overLimits = $derived(
    summary.library.filter(({ current, free }) => current > free),
  );
</script>

<DeckCard tone="default" {position} step={{ current: 2, total }}>
  {#snippet copy()}
    <DeckCardHeading
      eyebrow={m.tag_text_vip_cancel_library()}
      title={m.header_vip_cancel_library()}
      description={m.text_vip_cancel_library_description({
        plays: format(summary.stats.plays),
        hours: format(summary.stats.hours),
        ratings: format(summary.stats.ratings),
      })}
    />
  {/snippet}

  {#snippet visual()}
    <div class="trakt-vip-cancel-library">
      {#each overLimits as limit (limit.item)}
        <UsageLimitItem
          item={{
            title: LABELS[limit.item],
            limits: { current: limit.current, free: limit.free, vip: limit.vip },
          }}
          variant="free"
          isLoading={position !== 0}
        />
      {/each}
    </div>
  {/snippet}

  {#snippet actions()}
    <VipCancelButton
      look="primary"
      label={m.button_label_vip_cancel_continue()}
      onclick={onContinue}
    >
      {m.button_text_vip_cancel_continue()}
    </VipCancelButton>
    <VipCancelButton
      look="secondary"
      label={m.button_label_vip_cancel_keep()}
      onclick={onKeep}
    >
      {m.button_text_vip_cancel_keep()}
    </VipCancelButton>
  {/snippet}
</DeckCard>

<style lang="scss">
  .trakt-vip-cancel-library {
    display: grid;
    gap: var(--gap-l);
  }
</style>
