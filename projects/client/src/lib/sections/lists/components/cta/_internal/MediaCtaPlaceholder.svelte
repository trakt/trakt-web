<script lang="ts">
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import ReleasedIcon from "../icons/ReleasedIcon.svelte";
  import UnreleasedIcon from "../icons/UnreleasedIcon.svelte";
  import UpcomingIcon from "../icons/UpcomingIcon.svelte";
  import UpNextIcon from "../icons/UpNextIcon.svelte";
  import type { Cta } from "../models/Cta";
  import CtaListCard from "./CtaListCard.svelte";
  import MediaCtaButton from "./MediaCtaButton.svelte";
  import { useCtaCardVariant } from "./useCtaCardVariant";
  import { usePlaceholderCover } from "./usePlaceholderCover";

  const {
    cta,
    intl,
  }: {
    cta: Exclude<Cta, "activity">;
    intl: CtaItemIntl;
  } = $props();

  const defaultVariant = $derived(useCtaCardVariant(cta));
  const { cover } = $derived(usePlaceholderCover(cta));
</script>

{#snippet ctaIcon()}
  <div class="trakt-cta-icon">
    {#if cta === "up-next" || cta === "personal-activity"}
      <UpNextIcon />
    {/if}

    {#if cta === "released"}
      <ReleasedIcon />
    {/if}

    {#if cta === "upcoming" || cta === "calendar"}
      <UpcomingIcon />
    {/if}

    {#if cta === "unreleased"}
      <UnreleasedIcon />
    {/if}
  </div>
{/snippet}

<CtaListCard variant={$defaultVariant} src={$cover?.url.medium}>
  <div class="trakt-cta-placeholder">
    <div class="trakt-cta-description">
      <div class="trakt-cta-list-text">
        <p>{intl.text({ cta })}</p>
        <RenderFor audience="authenticated" device={["mobile"]}>
          {@render ctaIcon()}
        </RenderFor>
      </div>

      <MediaCtaButton {cta} {intl} size="small">
        {#snippet icon()}
          <SearchIcon />
        {/snippet}
      </MediaCtaButton>
    </div>

    <RenderFor
      audience="authenticated"
      device={["desktop", "tablet-lg", "tablet-sm"]}
    >
      {@render ctaIcon()}
    </RenderFor>
  </div>
</CtaListCard>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-cta-placeholder {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 100%;

    gap: var(--gap-m);
  }

  .trakt-cta-description {
    display: flex;
    flex-direction: column;

    gap: var(--gap-m);

    @include for-mobile {
      height: 100%;
      justify-content: space-between;
      gap: var(--gap-xxs);

      :global(.trakt-button) {
        width: 100%;
      }
    }
  }

  .trakt-cta-list-text {
    display: flex;
    align-items: center;

    max-width: var(--ni-520);
    gap: var(--gap-m);

    :global(svg) {
      width: var(--ni-80);
      height: var(--ni-80);
    }

    @include for-mobile {
      align-items: flex-start;

      p {
        font-size: var(--ni-14);
      }
    }
  }

  .trakt-cta-icon {
    display: flex;
    align-items: center;

    opacity: 0.8;

    z-index: var(--layer-raised);
  }
</style>
