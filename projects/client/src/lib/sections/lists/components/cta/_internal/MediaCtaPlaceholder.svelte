<script lang="ts">
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import ReleasedIcon from "../icons/ReleasedIcon.svelte";
  import UnreleasedIcon from "../icons/UnreleasedIcon.svelte";
  import UpcomingIcon from "../icons/UpcomingIcon.svelte";
  import UpNextIcon from "../icons/UpNextIcon.svelte";
  import type { Cta } from "../models/Cta";
  import CtaListCard from "./CtaListCard.svelte";
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

<CtaListCard variant={$defaultVariant} coverSrc={$cover?.url.medium}>
  <p class="smaller">{intl.text({ cta })}</p>

  <MediaCtaButton {cta} {intl} style="flat" />

  {#snippet icon()}
    {#if cta === "up-next"}
      <UpNextIcon />
    {/if}

    {#if cta === "released"}
      <ReleasedIcon />
    {/if}

    {#if cta === "upcoming"}
      <UpcomingIcon />
    {/if}

    {#if cta === "unreleased"}
      <UnreleasedIcon />
    {/if}
  {/snippet}
</CtaListCard>
