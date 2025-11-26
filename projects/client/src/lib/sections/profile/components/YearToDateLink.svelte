<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ExternalLinkIcon from "../../../components/icons/ExternalLinkIcon.svelte";

  const { slug }: { slug: string } = $props();

  const currentYear = new Date().getFullYear();

  const href = UrlBuilder.users(slug).yearToDate(currentYear);
</script>

<trakt-year-to-date-link>
  <Link {href}>
    <div class="ytd-link-content">
      <span class="bold ytd-year">{currentYear}</span>
      <ExternalLinkIcon />
    </div>
  </Link>
</trakt-year-to-date-link>

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

  .ytd-link-content {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
