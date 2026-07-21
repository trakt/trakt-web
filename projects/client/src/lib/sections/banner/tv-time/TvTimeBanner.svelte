<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import TvTimeIcon from "$lib/components/icons/TvTimeIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import BannerContainer from "../_internal/BannerContainer.svelte";
  import DismissButton from "../_internal/DismissButton.svelte";
  import { useTvTimeBanner } from "./_internal/useTvTimeBanner.ts";
  import { TV_TIME_BANNER_ID } from "./constants/index.ts";

  const { isVisible, dismiss } = useTvTimeBanner();
  const { track } = useTrack(AnalyticsEvent.Link);
</script>

{#if $isVisible}
  <BannerContainer>
    <section class="trakt-tv-time-banner">
      <div class="tv-time-banner-dismiss">
        <DismissButton onDismiss={dismiss} />
      </div>

      <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
        <div class="tv-time-banner-icon" aria-hidden="true">
          <TvTimeIcon />
        </div>
      </RenderFor>

      <div class="tv-time-banner-content">
        <h2 class="bold tv-time-banner-title">
          {m.tv_time_banner_heading()}
          <RenderFor audience="all" device={["tablet-sm", "mobile"]}>
            <TvTimeIcon />
          </RenderFor>
        </h2>
        <p class="secondary">{m.tv_time_banner_description()}</p>
      </div>

      <Button
        href={UrlBuilder.app.tvTime()}
        target="_blank"
        color="purple"
        variant="primary"
        style="outline"
        size="small"
        label={m.tv_time_banner_action()}
        onclick={() =>
          track({
            source: TV_TIME_BANNER_ID,
            target: UrlBuilder.app.tvTime(),
          })}
      >
        {#snippet icon()}
          <ExternalLinkIcon size="small" />
        {/snippet}
        {m.tv_time_banner_action()}
      </Button>
    </section>
  </BannerContainer>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-tv-time-banner {
    position: relative;
    overflow: hidden;

    display: flex;
    align-items: center;
    gap: var(--gap-l);

    width: 100%;
    box-sizing: border-box;

    padding: var(--gap-l) var(--gap-xl);
    padding-inline-end: var(--ni-48);

    background: color-mix(
      in srgb,
      var(--color-card-background) 80%,
      transparent
    );
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);
    border-radius: var(--border-radius-xl);

    transition: var(--transition-increment) ease-in-out;
    transition-property: padding, gap;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;

      background: radial-gradient(
        85% 130% at 100% 0%,
        color-mix(in srgb, var(--purple-500) 12%, transparent),
        transparent 60%
      );
    }

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-m);

      padding: var(--gap-l);
      padding-inline-end: var(--ni-48);
    }

    /* Uniform CTA width across the intro banners (EN reference:
       "Import your data") so the stacked buttons don't zigzag. Label and
       arrow sit as a tight centered cluster, mirroring the VIP CTA. */
    :global(.trakt-button) {
      min-width: var(--ni-132);
      justify-content: center;
      gap: var(--gap-xs);
    }

    /* The external-link glyph fills its viewBox, so at the shared icon size
       it reads oversized next to the welcome banner's sparkle — pull it in. */
    :global(.trakt-button .button-icon svg) {
      height: var(--ni-14);
    }

    /* The label is a bare domain — undo the button's default first-letter
       capitalisation ("Tvtime…" reads wrong for a URL). */
    :global(.trakt-button .button-label p::first-letter) {
      text-transform: none;
    }
  }

  .tv-time-banner-dismiss {
    position: absolute;
    z-index: 1;

    top: var(--ni-8);
    inset-inline-end: var(--ni-8);
  }

  .tv-time-banner-icon {
    position: relative;
    flex-shrink: 0;

    display: grid;
    place-items: center;

    width: var(--ni-48);
    height: var(--ni-48);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .tv-time-banner-content {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    flex: 1 1 auto;

    @include for-tablet-sm-and-below {
      gap: var(--gap-s);
    }
  }

  .tv-time-banner-title {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }
</style>
