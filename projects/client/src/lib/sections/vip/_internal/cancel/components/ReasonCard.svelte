<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipCancelReason } from "../models/VipCancelReason.ts";
  import DeckCard from "./DeckCard.svelte";
  import DeckCardHeading from "./DeckCardHeading.svelte";
  import type { ReasonCardProps } from "./ReasonCardProps.ts";
  import VipCancelButton from "./VipCancelButton.svelte";

  const {
    position,
    total,
    reason,
    onReason,
    onContinue,
    onKeep,
  }: ReasonCardProps = $props();

  const REASONS: ReadonlyArray<{ value: VipCancelReason; text: () => string }> =
    [
      { value: "price", text: () => m.text_vip_cancel_reason_price() },
      { value: "usage", text: () => m.text_vip_cancel_reason_usage() },
      { value: "feature", text: () => m.text_vip_cancel_reason_feature() },
      { value: "broken", text: () => m.text_vip_cancel_reason_broken() },
      { value: "switch", text: () => m.text_vip_cancel_reason_switch() },
      { value: "break", text: () => m.text_vip_cancel_reason_break() },
    ];
</script>

<DeckCard tone="default" {position} step={{ current: 1, total }}>
  {#snippet copy()}
    <DeckCardHeading
      eyebrow={m.tag_text_vip_cancel_reason()}
      title={m.header_vip_cancel_reason()}
      description={m.text_vip_cancel_reason_description()}
    />
  {/snippet}

  {#snippet visual()}
    <div class="trakt-vip-cancel-reasons">
      <div
        class="reason-options"
        role="group"
        aria-label={m.header_vip_cancel_reason()}
      >
        {#each REASONS as option (option.value)}
          <Button
            label={option.text()}
            aria-pressed={reason === option.value ? "true" : "false"}
            onclick={() => onReason(option.value)}
            size="small"
            style="flat"
            text="none"
            color={reason === option.value ? "purple" : "default"}
            variant={reason === option.value ? "primary" : "secondary"}
          >
            {option.text()}
          </Button>
        {/each}
      </div>
    </div>
  {/snippet}

  {#snippet actions()}
    <VipCancelButton
      look="primary"
      label={m.button_label_vip_cancel_continue()}
      onclick={onContinue}
      disabled={!reason}
    >
      {m.button_text_vip_cancel_continue()}
    </VipCancelButton>
    <VipCancelButton
      look="secondary"
      label={m.button_label_vip_cancel_never_mind()}
      onclick={onKeep}
    >
      {m.button_text_vip_cancel_never_mind()}
    </VipCancelButton>
  {/snippet}
</DeckCard>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-cancel-reasons {
    display: grid;
    gap: var(--gap-m);
  }

  .reason-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-s);
  }
</style>
