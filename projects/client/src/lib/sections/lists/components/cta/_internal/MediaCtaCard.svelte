<script lang="ts">
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { MediaCta } from "../models/Cta";
  import CtaCard from "./CtaCard.svelte";
  import MediaCtaButton from "./MediaCtaButton.svelte";
  import { useCtaCardVariant } from "./useCtaCardVariant";
  import { usePlaceholderCover } from "./usePlaceholderCover";

  const {
    cta,
    intl,
  }: {
    cta: MediaCta;
    intl: CtaItemIntl;
  } = $props();

  const defaultVariant = $derived(useCtaCardVariant(cta));
  const { cover } = $derived(usePlaceholderCover(cta));
</script>

<CtaCard variant={$defaultVariant} src={$cover?.url.medium}>
  <p class="smaller">{intl.text({ cta })}</p>

  {#snippet action()}
    <MediaCtaButton {cta} {intl} size="tag" />
  {/snippet}
</CtaCard>
