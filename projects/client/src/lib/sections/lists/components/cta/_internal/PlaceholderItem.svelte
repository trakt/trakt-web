<script lang="ts">
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Snippet } from "svelte";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { ListCta, MediaCta } from "../models/Cta";
  import CtaButton from "./CtaButton.svelte";
  import CtaListCard from "./CtaListCard.svelte";
  import { useCtaCardVariant } from "./useCtaCardVariant";
  import { usePlaceholderCover } from "./usePlaceholderCover";

  const {
    cta,
    intl,
    icon,
  }: {
    cta: MediaCta | ListCta;
    intl: CtaItemIntl;
    icon: Snippet;
  } = $props();

  const defaultVariant = $derived(useCtaCardVariant(cta));
  const { cover } = $derived(usePlaceholderCover(cta));
</script>

{#snippet ctaIcon()}
  <div class="trakt-cta-icon">
    {@render icon()}
  </div>
{/snippet}

{#snippet buttonIcon()}
  {#if cta.type === "personal-list"}
    <PlusIcon />
  {:else}
    <SearchIcon />
  {/if}
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

      <CtaButton {cta} {intl} icon={buttonIcon} size="small" />
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
        justify-content: center;
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
