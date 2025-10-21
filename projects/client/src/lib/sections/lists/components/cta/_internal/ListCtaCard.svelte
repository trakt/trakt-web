<script lang="ts">
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { Cta } from "../models/Cta";
  import CtaCard from "./CtaCard.svelte";
  import { useCtaCardVariant } from "./useCtaCardVariant";
  import { usePlaceholderCover } from "./usePlaceholderCover";

  const { intl }: { intl: CtaItemIntl } = $props();

  const cta: Cta = { type: "personal-list" };

  const defaultVariant = $derived(useCtaCardVariant(cta));
  const { cover } = $derived(usePlaceholderCover(cta));
</script>

<CtaCard variant={$defaultVariant} src={$cover?.url.medium}>
  <p class="smaller">{intl.text({ cta })}</p>
</CtaCard>
