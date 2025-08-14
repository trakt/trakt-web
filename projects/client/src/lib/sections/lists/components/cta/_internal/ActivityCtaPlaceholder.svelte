<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import ActivityIcon from "../icons/ActivityIcon.svelte";
  import CtaListCard from "./CtaListCard.svelte";
  import TraktTeam from "./TraktTeam.svelte";

  const { intl }: { intl: CtaItemIntl } = $props();
</script>

<CtaListCard variant="landscape" src={DEFAULT_COVER}>
  <div class="trakt-cta-activity">
    <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
      <TraktTeam {intl} limit={5} />
    </RenderFor>
    <RenderFor audience="all" device={["tablet-lg"]}>
      <TraktTeam {intl} limit={8} />
    </RenderFor>
    <RenderFor audience="all" device={["desktop"]}>
      <TraktTeam {intl} />
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

    :global(p.smaller) {
      font-size: var(--ni-16);
    }

    @include for-mobile {
      :global(.trakt-team) {
        width: 100%;
      }

      :global(p.smaller) {
        font-size: var(--ni-14);
      }
    }
  }
</style>
