<script lang="ts">
  import type { CtaItemIntl } from "../CtaItemIntl";
  import CtaCard from "./CtaCard.svelte";
  import TraktTeam from "./TraktTeam.svelte";

  const { intl }: { intl: CtaItemIntl } = $props();
</script>

<CtaCard variant="activity">
  <TraktTeam {intl} />
</CtaCard>
