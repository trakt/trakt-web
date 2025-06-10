<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YearToDateArrow from "../../../components/icons/YearToDateArrow.svelte";

  const { isVip, slug }: { isVip: boolean; slug: string } = $props();

  const currentYear = new Date().getFullYear();

  const hasYearToDateLink = $derived(isVip);
  const href = UrlBuilder.users(slug).yearToDate(currentYear);
</script>

{#if hasYearToDateLink}
  <trakt-year-to-date-link>
    <Link {href}>
      <div class="ytd-link-content">
        <h4 class="ytd-year uppercase">{currentYear}</h4>
        <div class="ytd-link-details">
          <h6 class="ytd-label uppercase">Year to date</h6>
          <YearToDateArrow />
        </div>
      </div>
    </Link>
  </trakt-year-to-date-link>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-year-to-date-link {
    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      justify-self: flex-end;

      width: fit-content;
    }
  }

  .ytd-link-details {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    text-transform: uppercase;

    .ytd-label {
      max-width: var(--ni-72);
      font-weight: 700;
    }
  }

  .ytd-link-content {
    display: flex;
    gap: var(--gap-m);

    :global(svg) {
      width: var(--ni-28);
      height: var(--ni-28);
    }

    @include for-mobile {
      .ytd-link-details {
        gap: var(--gap-xs);
      }
    }
  }
</style>
