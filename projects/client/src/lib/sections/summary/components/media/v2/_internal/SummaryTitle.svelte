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

    const director = crew.directors?.at(0);
    return (
      director && {
        text: m.text_directed_by({ name: director.name }),
        key: director.key,
      }
    );
  });
</script>

<div class="trakt-summary-title">
  <h2
    data-testid={TestId.SummaryMediaTitle}
    class:short-title={title.length < 15}
    class:long-title={title.length > 25}
  >
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

<style>
  .trakt-summary-title {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: var(--gap-micro);
  }

  h2 {
    --text-size: 7cqi;

    &.short-title {
      --text-size: 10cqi;
    }

    &.long-title {
      --text-size: 2.5cqi;
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-32));
    text-align: center;
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
