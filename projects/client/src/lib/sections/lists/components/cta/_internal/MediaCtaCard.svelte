<script lang="ts">
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { Cta } from "../models/Cta";
  import CtaCard from "./CtaCard.svelte";
  import MediaCtaButton from "./MediaCtaButton.svelte";
  import { usePlaceholderCover } from "./usePlaceholderCover";

  const {
    cta,
    intl,
  }: {
    cta: Exclude<Cta, "activity">;
    intl: CtaItemIntl;
  } = $props();

  const type = $derived(
    cta === "up-next" || cta === "upcoming" ? "episode" : "movie",
  );

  const defaultVariant = $derived(useDefaultCardVariant(type));
  const { cover } = $derived(usePlaceholderCover(cta));
</script>

<CtaCard variant={$defaultVariant} src={$cover?.url.medium}>
  <p class="smaller">{intl.text({ cta })}</p>

  {#snippet action()}
    <MediaCtaButton {cta} {intl} size="tag" />
  {/snippet}
</CtaCard>
