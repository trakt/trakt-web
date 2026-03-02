<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { toHumanDayTime } from "$lib/utils/formatting/date/toHumanDayTime.ts";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { mapToMainCredit } from "./mapToMainCredit";
  import { mapToSummaryStatus } from "./mapToSummaryStatus";
  import { mapToSummarySubtitle } from "./mapToSummarySubtitle";
  import ResponsiveTitle from "./ResponsiveTitle.svelte";
  import type { SummaryTitleProps } from "./SummaryTitleProps";

  const ENDED_STATUSES = ["ended", "canceled"];

  const { title, crew, ...target }: SummaryTitleProps = $props();

  let now = $state(new Date());

  $effect(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 60_000);

    return () => clearInterval(interval);
  });

  const subtitle = $derived(mapToSummarySubtitle(target));
  const mainCredit = $derived(mapToMainCredit(target.type, crew));

  const status = $derived.by(() => {
    if (target.type === "episode") {
      return;
    }

    return mapToSummaryStatus({ media: target.media, now });
  });

  const airsText = $derived.by(() => {
    if (target.type !== "show") return;

    const { airs, network, status: showStatus } = target.media;
    if (!airs || ENDED_STATUSES.includes(showStatus)) return;

    const local = toHumanDayTime(airs, languageTag());
    if (!local) return;

    const label = target.media.airDate > now
      ? m.header_expected_premiere()
      : m.header_airs();

    const schedule = network
      ? m.text_airs_day_time_network({ ...local, network })
      : m.text_airs_day_time(local);

    return `${label} ${schedule}`;
  });
</script>

<div class="trakt-summary-title" data-testid={TestId.SummaryMediaTitle}>
  <ResponsiveTitle {title} />

  {#if mainCredit}
    <p class="tiny trakt-media-main-credit">
      <MessageWithLink
        message={mainCredit.text}
        href={UrlBuilder.people(mainCredit.key, mainCredit.positions)}
        target="_self"
      />
    </p>
  {/if}

  <p class="secondary">
    {subtitle}
  </p>

  {#if status}
    <p class="capitalize bold trakt-media-status">
      {toTranslatedStatus(status)}
    </p>
  {/if}

  {#if airsText}
    <p class="small secondary">
      {airsText}
    </p>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-title {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xs);
    transition: gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      gap: var(--gap-micro);
      align-items: center;

      :global(.trakt-responsive-title) {
        text-align: center;
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
