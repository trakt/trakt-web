<script lang="ts">
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { Cta } from "../models/Cta";
  import CtaCard from "./CtaCard.svelte";
  import MediaCtaButton from "./MediaCtaButton.svelte";

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
</script>

<CtaCard variant={$defaultVariant}>
  <p class="smaller">{intl.text({ cta })}</p>

  {#snippet action()}
    <MediaCtaButton {cta} {intl} style="ghost" />
  {/snippet}
</CtaCard>
