<script lang="ts">
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { ListCta, MediaCta } from "../models/Cta";
  import CtaButton from "./CtaButton.svelte";
  import CtaListCard from "./CtaListCard.svelte";
  import { useCtaCardVariant } from "./useCtaCardVariant";
  import { usePlaceholderCover } from "./usePlaceholderCover";

  const {
    cta,
    intl,
  }: {
    cta: MediaCta | ListCta;
    intl: CtaItemIntl;
  } = $props();

  const defaultVariant = $derived(useCtaCardVariant(cta));
  const { cover } = $derived(usePlaceholderCover(cta));

  // Keep the first two (short) sentences on one row and the remainder on the
  // next. Locales that don't use ". " sentence breaks fall back to one line.
  const text = $derived.by(() => {
    const copy = intl.text({ cta });
    const sentences = copy.split(/(?<=\.)\s+/);

    if (sentences.length < 3) {
      return copy;
    }

    const firstRow = sentences.slice(0, 2).join(" ");
    const secondRow = sentences.slice(2).join(" ");

    return `${firstRow}\n${secondRow}`;
  });
</script>

{#snippet buttonIcon()}
  {#if cta.type === "personal-list" || cta.type === "smart-list"}
    <PlusIcon />
  {:else}
    <SearchIcon />
  {/if}
{/snippet}

<CtaListCard variant={$defaultVariant} src={$cover?.url.medium}>
  <div class="trakt-cta-placeholder">
    <div class="trakt-cta-description">
      <div class="trakt-cta-list-text">
        <p>{text}</p>
      </div>

      <CtaButton {cta} {intl} icon={buttonIcon} size="small" />
    </div>
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

    padding-inline-start: var(--gap-xl);

    @include for-mobile {
      padding-inline-start: 0;
    }
  }

  .trakt-cta-description {
    display: flex;
    flex-direction: column;

    flex-grow: 1;

    gap: var(--gap-m);

    @include for-mobile {
      height: 100%;
      justify-content: space-between;
      gap: var(--gap-xxs);

      .trakt-cta-list-text {
        flex-grow: 1;
        display: flex;
        align-items: center;
      }

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

    p {
      white-space: pre-line;
    }

    :global(svg) {
      width: var(--ni-80);
      height: var(--ni-80);
    }

    @include for-mobile {
      align-items: flex-start;
    }
  }
</style>
