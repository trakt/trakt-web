<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import Link from "$lib/components/link/Link.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DetailsButton from "../media/v2/_internal/DetailsButton.svelte";
  import { mapToMainCredit } from "./mapToMainCredit";
  import { mapToSummaryStatus } from "./mapToSummaryStatus";
  import { mapToSummarySubtitle } from "./mapToSummarySubtitle";
  import ResponsiveTitle from "./ResponsiveTitle.svelte";
  import type { SummaryTitleProps } from "./SummaryTitleProps";

  const { title, crew, ...target }: SummaryTitleProps = $props();

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

<div class="trakt-summary-title" data-testid={TestId.SummaryMediaTitle}>
  <ResponsiveTitle {title} />

  {#if mainCredit}
    <p class="tiny trakt-media-main-credit">
      <MessageWithLink
        message={mainCredit.text}
        href={UrlBuilder.people(mainCredit.key, mainCredit.positions)}
        target="_self"
      />
      {#each mainCredit.others ?? [] as person (person.key)}
        {", "}
        <Link
          href={UrlBuilder.people(person.key, mainCredit.positions)}
          target="_self">{person.name}</Link
        >
      {/each}
    </p>
  {/if}

  <div class="trakt-summary-subtitle">
    <p class="secondary">
      {subtitle}
    </p>

    <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
      <DetailsButton style="action" size="small" {title} />
    </RenderFor>
  </div>

  {#if status}
    <p class="capitalize bold trakt-media-status">
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

      :global(.trakt-responsive-title) {
        text-align: center;
      }
    }
  }

  .trakt-summary-subtitle {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
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
