<script lang="ts">
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import ActivityIcon from "../icons/ActivityIcon.svelte";
  import CtaListCard from "./CtaListCard.svelte";
  import TraktTeam from "./TraktTeam.svelte";

  const { intl }: { intl: CtaItemIntl } = $props();
</script>

<CtaListCard variant="landscape" coverSrc={DEFAULT_COVER}>
  <TraktTeam {intl} />

  {#snippet icon()}
    <ActivityIcon />
  {/snippet}
</CtaListCard>
