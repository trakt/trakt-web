<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DetailsButton from "../media/v2/_internal/DetailsButton.svelte";
  import { mapToMainCredit } from "./mapToMainCredit";
  import { mapToSummaryStatus } from "./mapToSummaryStatus";
  import { mapToSummarySubtitle } from "./mapToSummarySubtitle";
  import GlanceTitleLink from "./GlanceTitleLink.svelte";
  import ResponsiveTitle from "./ResponsiveTitle.svelte";
  import type { SummaryTitleProps } from "./SummaryTitleProps";

  const {
    title,
    crew,
    href,
    hasDetails = true,
    hasReservedRows = false,
    ...target
  }: SummaryTitleProps = $props();

  const subtitle = $derived(mapToSummarySubtitle(target));
  const mainCredit = $derived(mapToMainCredit(target.type, crew));

  const status = $derived.by(() => {
    if (target.type === "episode") {
      return;
    }

    const now = new Date();
    return mapToSummaryStatus({ media: target.media, now });
  });
</script>

<div class="trakt-summary-title">
  <div class="trakt-summary-title-slot">
    {#if href}
      <GlanceTitleLink {href}>
        <ResponsiveTitle {title} />
      </GlanceTitleLink>
    {:else}
      <ResponsiveTitle {title} />
    {/if}
  </div>

  {#if mainCredit || hasReservedRows}
    <p class="tiny trakt-media-main-credit">
      {#if mainCredit}
      <MessageWithLink
        message={mainCredit.text}
        href={UrlBuilder.people(mainCredit.key, mainCredit.positions)}
        target="_self"
      />{#if mainCredit.others?.[0]}{", "}<Link
          href={UrlBuilder.people(
            mainCredit.others[0].key,
            mainCredit.positions,
          )}
          target="_self">{mainCredit.others[0].name}</Link
        >{/if}
      {/if}
    </p>
  {/if}

  <div class="trakt-summary-subtitle">
    <p class="secondary">
      {subtitle}
    </p>

    {#if hasDetails}
      <DetailsButton style="action" size="small" {title} />
    {/if}
  </div>

  {#if status || hasReservedRows}
    <p class="capitalize bold trakt-media-status">
      {status ? toTranslatedStatus(status) : ""}
    </p>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @mixin compact-title {
    gap: var(--gap-micro);
    align-items: center;

    :global(.trakt-responsive-title) {
      text-align: center;
    }
  }

  .trakt-summary-title {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xs);
    transition: gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      @include compact-title;
    }

    :global(.trakt-summary[data-variant="drawer"]) & {
      @include compact-title;

      min-width: 0;
      max-width: 100%;

      .trakt-summary-title-slot {
        display: flex;
        align-items: flex-start;

        min-width: 0;
        max-width: 100%;

        min-height: calc(var(--glance-title-lines) * 1lh);
      }

      .trakt-media-main-credit,
      .trakt-media-status,
      .trakt-summary-subtitle {
        min-height: var(--glance-line-height);
      }
    }
  }

  .trakt-summary-subtitle {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    @include for-tablet-sm-and-below {
      :global(.trakt-action-button) {
        width: var(--ni-32);
        height: var(--ni-32);
        position: relative;

        &::after {
          content: "";
          position: absolute;
          inset: calc(var(--ni-neg-8) * 1.5);
        }
      }
    }
  }

  .trakt-media-status {
    color: var(--color-text-emphasis);
  }

  .trakt-media-main-credit {
    :global(.trakt-link) {
      text-decoration-thickness: var(--ni-1);
    }
  }
</style>
