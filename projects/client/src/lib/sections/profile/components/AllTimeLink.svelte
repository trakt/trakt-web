<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";

  const { slug, source }: { slug: string; source: string } = $props();

  const { isMe } = $derived(useIsMe(slug));
  const { user } = useUser();

  const linkSlug = $derived($isMe ? $user.slug : slug);
  const href = $derived(UrlBuilder.users(linkSlug).allTime());
  const { track } = useTrack(AnalyticsEvent.Link);
</script>

<trakt-all-time-link>
  <Link {href} onclick={() => track({ source, target: href })} color="inherit">
    <div class="all-time-link-content">
      <span class="bold">{m.text_all_time()}</span>
      <ExternalLinkIcon />
    </div>
  </Link>
</trakt-all-time-link>

<style>
  trakt-all-time-link {
    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      justify-self: flex-end;

      width: fit-content;
    }
  }

  .all-time-link-content {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    color: inherit;
  }
</style>
