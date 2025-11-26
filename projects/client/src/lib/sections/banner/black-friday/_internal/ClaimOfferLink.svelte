<script lang="ts">
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DealEnd from "./DealEnd.svelte";

  const { endDate }: { endDate: Date } = $props();
</script>

<div class="trakt-black-friday-claim-offer">
  <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
    <DealEnd {endDate} />
  </RenderFor>

  <Link href={UrlBuilder.vip()} target="_blank">
    <ExternalLinkIcon size="small" />
    <span class="no-wrap">Claim offer</span>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-black-friday-claim-offer {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      background-color: var(--purple-500);
      border-radius: var(--border-radius-l);
      padding: var(--ni-8) var(--ni-12);

      text-decoration: none;

      transition: padding var(--transition-increment) ease-in-out;

      @include for-mouse() {
        &:hover {
          color: var(--purple-100);
        }
      }
    }

    @include for-tablet-lg {
      flex-direction: column-reverse;
      gap: var(--gap-micro);

      :global(.trakt-link) {
        padding: var(--ni-4) var(--ni-10);
      }
    }

    @include for-tablet-sm-and-below {
      flex-direction: row-reverse;
      gap: var(--gap-xs);
    }
  }
</style>
