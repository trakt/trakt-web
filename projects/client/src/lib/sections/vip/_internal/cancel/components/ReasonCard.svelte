<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import type { VipCancelReason } from "../models/VipCancelReason.ts";
  import { cleanCancelDetails } from "../utils/cleanCancelDetails.ts";
  import DeckCard from "./DeckCard.svelte";
  import DeckCardHeading from "./DeckCardHeading.svelte";
  import type { ReasonCardProps } from "./ReasonCardProps.ts";
  import VipCancelButton from "./VipCancelButton.svelte";

  const MAX_DETAILS = 200;
  const REVEAL_DURATION = 280;

  const {
    position,
    total,
    reason,
    details,
    onReason,
    onDetails,
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
      { value: "other", text: () => m.text_vip_cancel_reason_other() },
    ];

  const PLACEHOLDERS: Partial<Record<VipCancelReason, () => string>> = {
    feature: () => m.input_placeholder_vip_cancel_feature(),
    other: () => m.input_placeholder_vip_cancel_other(),
  };

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const reveal = (node: Element) => {
    const height = slide(node, {
      duration: $isReducedMotion ? 0 : REVEAL_DURATION,
      easing: cubicOut,
    });

    return {
      ...height,
      css: (t: number, u: number) =>
        `${height.css?.(t, u) ?? ""}; opacity: ${t};`,
    };
  };

  const placeholder = $derived(reason ? PLACEHOLDERS[reason]?.() : null);
  const cleaned = $derived(cleanCancelDetails(details));
  const hasCleaned = $derived(cleaned !== details.trim());
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

      {#if placeholder}
        <div
          class="reason-details"
          aria-label={m.input_label_vip_cancel_details()}
          transition:reveal
        >
          <FormTextArea
            value={details}
            {placeholder}
            rows={3}
            disabled={false}
            onChange={(value) => onDetails(value.slice(0, MAX_DETAILS))}
          />
          <p class="reason-details-hint small">
            {m.text_vip_cancel_details_count({
              count: details.length,
              max: MAX_DETAILS,
            })}
            {#if hasCleaned}
              · {m.text_vip_cancel_details_cleaned({ text: cleaned })}
            {/if}
          </p>
        </div>
      {/if}
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


  .reason-details {
    display: grid;
    gap: var(--gap-xs);
  }

  .reason-details-hint {
    margin: 0;
    min-height: var(--ni-18);
    color: var(--deck-card-muted);
  }
</style>
