<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { mapToSummarySubtitle } from "./mapToSummarySubtitle";
  import type { SummaryTitleProps } from "./SummaryTitleProps";

  const { title, status, crew, ...target }: SummaryTitleProps = $props();

  const subtitle = $derived(mapToSummarySubtitle(target));

  const mainCredit = $derived.by(() => {
    if (target.type === "show") {
      const creator = crew.creators?.at(0);
      return (
        creator && {
          text: m.text_created_by({ name: creator.name }),
          key: creator.key,
        }
      );
    }

    const director = crew.directors?.find((director) =>
      director.jobs.map((job) => job.toLowerCase()).includes("director"),
    );
    return (
      director && {
        text: m.text_directed_by({ name: director.name }),
        key: director.key,
      }
    );
  });
</script>

<div class="trakt-summary-title">
  <h2 data-testid={TestId.SummaryMediaTitle}>
    {title}
  </h2>

  {#if mainCredit}
    <p class="tiny trakt-media-main-credit">
      <MessageWithLink
        message={mainCredit.text}
        href={UrlBuilder.people(mainCredit.key)}
        target="_self"
      />
    </p>
  {/if}

  <p class="secondary">
    {subtitle}
  </p>

  {#if status}
    <p class="capitalize meta-info trakt-media-status">
      {toTranslatedStatus(status)}
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
    }
  }

  h2 {
    font-size: var(--font-size-title);

    @include for-tablet-sm-and-below {
      text-align: center;
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
