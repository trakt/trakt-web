<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ExternalLinkIcon from "../../../components/icons/ExternalLinkIcon.svelte";

  const {
    slug,
    source,
    variant = "normal",
  }: {
    slug: string;
    source: string;
    variant?: "normal" | "compact";
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

  const isCompact = $derived(variant === "compact");
</script>

<trakt-year-to-date-link class:is-compact={isCompact}>
  {#if !isCompact}
    <!-- TODO this component should be link only, move header out -->
    <span class="secondary bold">365 Days Later</span>
  {/if}

  <Link {href} onclick={() => track({ source, target: href })}>
    <div class="ytd-link-content" class:is-compact={isCompact}>
      <span class="bold ytd-year" class:is-compact={isCompact}
        >{currentYear}</span
      >
      {#if isCompact}
        <ExternalLinkIcon />
      {:else}
        <div class="ytd-label-and-icon">
          <div class="ytd-labels">
            <span class="uppercase">Year</span>
            <span class="uppercase">to Date</span>
          </div>
          <ExternalLinkIcon />
        </div>
      {/if}
    </div>
  </Link>
</trakt-year-to-date-link>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-year-to-date-link {
    max-width: var(--ni-288);
    width: 100%;

    :global(.trakt-link[data-color="default"]) {
      color: inherit;
      text-decoration: none;

      display: flex;
      justify-self: flex-end;

      width: fit-content;
    }

    &:not(.is-compact) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      height: 100%;
    }
  }

  .ytd-link-content {
    display: flex;
    gap: var(--gap-xs);
    color: inherit;

    &:not(.is-compact) {
      align-items: flex-start;
      flex-direction: column;
    }

    &.is-compact {
      align-items: center;
    }
  }

  .ytd-year {
    &:not(.is-compact) {
      font-size: var(--ni-60);
    }
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
