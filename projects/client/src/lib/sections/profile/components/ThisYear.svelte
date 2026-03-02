<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ExternalLinkIcon from "../../../components/icons/ExternalLinkIcon.svelte";

  const {
    slug,
    source,
  }: {
    slug: string;
    source: string;
  } = $props();

  const { isMe } = $derived(useIsMe(slug));
  const { user } = useUser();

  const now = new Date();
  const year = now.getFullYear();
  const isFirstMonth = now.getMonth() === 0;

  const currentYear = isFirstMonth ? year - 1 : year;

  const ytdSlug = $derived($isMe ? $user.slug : slug);
  const href = $derived(UrlBuilder.users(ytdSlug).yearToDate(currentYear));
  const { track } = useTrack(AnalyticsEvent.Link);

  // FIXME: replace with all time stats
</script>

<div class="trakt-this-year">
  <span class="secondary bold">{m.text_this_year()}</span>

  <Link {href} onclick={() => track({ source, target: href })}>
    <div class="ytd-link-content">
      <span class="bold ytd-year">{currentYear}</span>

      <div class="ytd-label-and-icon">
        <div class="ytd-labels">
          <span class="uppercase">Year</span>
          <span class="uppercase">to Date</span>
        </div>
        <ExternalLinkIcon />
      </div>
    </div>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-this-year {
    :global(.trakt-link[data-color="default"]) {
      color: inherit;
      text-decoration: none;

      display: flex;
      justify-self: flex-end;

      width: fit-content;
    }

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    height: 100%;
  }

  .ytd-link-content {
    display: flex;
    gap: var(--gap-xs);
    color: inherit;

    align-items: flex-start;
    flex-direction: column;
  }

  .ytd-year {
    font-size: var(--ni-60);
  }

  .ytd-label-and-icon {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(svg) {
      width: var(--ni-48);
      height: var(--ni-48);
    }
  }

  .ytd-labels {
    display: flex;
    flex-direction: column;
    line-height: 1;

    span.uppercase {
      font-size: var(--ni-24);
    }
  }
</style>
