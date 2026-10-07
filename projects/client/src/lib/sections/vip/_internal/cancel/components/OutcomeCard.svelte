<script lang="ts">
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate.ts";
  import { toVipPriceLabel } from "../../utils/toVipPriceLabel.ts";
  import type { DeckCardTone } from "./DeckCardProps.ts";
  import DeckCard from "./DeckCard.svelte";
  import DeckCardHeading from "./DeckCardHeading.svelte";
  import type { OutcomeCardProps } from "./OutcomeCardProps.ts";
  import VipCancelButton from "./VipCancelButton.svelte";

  const TWO_YEARS = 2;

  const { outcome, summary, offer }: OutcomeCardProps = $props();

  const date = $derived(toHumanLongDate(summary.endsAt, languageTag()));
  const until = $derived.by(() => {
    const end = new Date(summary.endsAt);
    end.setFullYear(end.getFullYear() + TWO_YEARS);
    return toHumanLongDate(end, languageTag());
  });

  const content = $derived.by(
    (): {
      tone: DeckCardTone;
      eyebrow: string;
      title: string;
      description: string;
    } => {
      switch (outcome) {
        case "claimed":
          return {
            tone: "celebrate",
            eyebrow: m.tag_text_vip_cancel_claimed(),
            title: m.header_vip_cancel_claimed(),
            description: m.text_vip_cancel_claimed({
              price: toVipPriceLabel(offer?.discountedAmount ?? 0),
              date,
              until,
            }),
          };
        case "kept":
          return {
            tone: "celebrate",
            eyebrow: m.tag_text_vip_cancel_kept(),
            title: m.header_vip_cancel_kept(),
            description: m.text_vip_cancel_kept({ date }),
          };
        case "cancelled":
          return {
            tone: "default",
            eyebrow: m.text_vip_cancel_card_title(),
            title: m.header_vip_cancel_cancelled(),
            description: m.text_vip_cancel_cancelled({ date }),
          };
      }
    },
  );
</script>

<DeckCard tone={content.tone} position={0}>
  {#snippet copy()}
    <DeckCardHeading
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    />
  {/snippet}


  {#snippet actions()}
    <VipCancelButton
      look="primary"
      label={m.button_label_vip_cancel_home()}
      href={UrlBuilder.home()}
    >
      {m.button_text_vip_cancel_home()}
    </VipCancelButton>
  {/snippet}
</DeckCard>
