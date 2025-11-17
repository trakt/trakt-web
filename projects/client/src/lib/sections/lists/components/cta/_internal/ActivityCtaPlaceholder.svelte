<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import ActivityIcon from "../icons/ActivityIcon.svelte";
  import type { SocialCta } from "../models/Cta";
  import CtaListCard from "./CtaListCard.svelte";
  import TraktTeam from "./TraktTeam.svelte";

  const { intl, cta }: { intl: CtaItemIntl; cta: SocialCta } = $props();
</script>

<CtaListCard variant="landscape" src={DEFAULT_COVER}>
  <div class="trakt-cta-activity">
    <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
      <TraktTeam {intl} {cta} limit={5} />
    </RenderFor>
    <RenderFor audience="all" device={["tablet-lg"]}>
      <TraktTeam {intl} {cta} limit={8} />
    </RenderFor>
    <RenderFor audience="all" device={["desktop"]}>
      <TraktTeam {intl} {cta} />
    </RenderFor>

    <RenderFor
      audience="authenticated"
      device={["desktop", "tablet-lg", "tablet-sm"]}
    >
      <ActivityIcon />
    </RenderFor>
  </div>
</CtaListCard>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-cta-activity {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 100%;
    gap: var(--gap-m);

    @include for-mobile {
      :global(.trakt-team) {
        width: 100%;
      }
    }
  }
</style>
