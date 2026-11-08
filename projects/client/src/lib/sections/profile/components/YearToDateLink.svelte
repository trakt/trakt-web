<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import { toYearToDateYear } from "./_internal/toYearToDateYear.ts";

  const { slug, source }: { slug: string; source: string } = $props();

  const { isMe } = $derived(useIsMe(slug));
  const { user } = useUser();

  const currentYear = toYearToDateYear(new Date());

  const ytdSlug = $derived($isMe ? $user.slug : slug);
  const href = $derived(UrlBuilder.users(ytdSlug).yearToDate(currentYear));
  const { track } = useTrack(AnalyticsEvent.Link);
</script>

<trakt-year-to-date-link>
  <Link {href} onclick={() => track({ source, target: href })} color="inherit">
    <div class="ytd-link-content">
      <span class="bold ytd-year">{currentYear}</span>
      <ExternalLinkIcon />
    </div>
  </Link>
</trakt-year-to-date-link>

<style>
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
    color: inherit;
  }
</style>
