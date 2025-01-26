<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YearToDateArrow from "./YearToDateArrow.svelte";

  const { current } = useUser();

  const currentYear = new Date().getFullYear();

  const href = current().isVip
    ? UrlBuilder.og.yearToDate(current().slug, currentYear)
    : UrlBuilder.og.getVip();
</script>

<Link {href} target="_blank">
  <div class="ytd-link-content">
    <h2 class="ytd-year">{currentYear}</h2>
    <div class="ytd-link-details">
      <h5 class="ytd-label">{m.year_to_date()}</h5>
      <YearToDateArrow />
    </div>
  </div>
</Link>

<style>
  .ytd-link-details {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    text-transform: uppercase;

    .ytd-label {
      max-width: var(--ni-112);
    }
  }

  .ytd-link-content {
    @media (max-width: 768px) {
      display: flex;
      gap: var(--gap-m);
    }

    @media (max-width: 480px) {
      .ytd-link-details {
        gap: var(--gap-xs);
      }

      .ytd-year {
        font-size: var(--ni-48);
      }

      .ytd-label {
        font-size: var(--ni-18);
        max-width: var(--ni-96);
      }

      :global(svg) {
        width: var(--ni-32);
        height: var(--ni-32);
      }
    }
  }
</style>
