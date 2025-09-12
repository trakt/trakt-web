<script lang="ts">
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { SocialCta } from "../models/Cta";
  import CtaCard from "./CtaCard.svelte";
  import TraktTeam from "./TraktTeam.svelte";

  const { intl, cta }: { intl: CtaItemIntl; cta: SocialCta } = $props();
</script>

<CtaCard variant="activity" src={DEFAULT_COVER}>
  <div class="trakt-team-content">
    <TraktTeam {intl} {cta} limit={5} />
  </div>
</CtaCard>

<style>
  .trakt-team-content {
    :global(.trakt-team-list) {
      width: 100%;

      justify-content: space-between;
    }
  }
</style>
