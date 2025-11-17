<script lang="ts">
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { ListCta } from "../models/Cta";
  import CtaCard from "./CtaCard.svelte";
  import { useCtaCardVariant } from "./useCtaCardVariant";
  import { usePlaceholderCover } from "./usePlaceholderCover";

  const { intl, cta }: { intl: CtaItemIntl; cta: ListCta } = $props();

  const defaultVariant = $derived(useCtaCardVariant(cta));
  const { cover } = $derived(usePlaceholderCover(cta));
</script>

<CtaCard variant={$defaultVariant} src={$cover?.url.medium}>
  <p>{intl.text({ cta })}</p>
</CtaCard>
