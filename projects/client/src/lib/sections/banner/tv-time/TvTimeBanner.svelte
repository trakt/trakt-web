<script lang="ts">
  import LogoMarkCircle from "$lib/components/logo/LogoMarkCircle.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import BannerContainer from "../_internal/BannerContainer.svelte";
  import BannerLink from "../_internal/BannerLink.svelte";
  import DismissButton from "../_internal/DismissButton.svelte";
  import { useTvTimeBanner } from "./_internal/useTvTimeBanner.ts";
  import { TV_TIME_BANNER_ID } from "./constants/index.ts";

  const { isVisible, dismiss } = useTvTimeBanner();
</script>

{#if $isVisible}
  <BannerContainer>
    <section class="trakt-tv-time-banner">
      <div class="tv-time-banner-dismiss">
        <DismissButton onDismiss={dismiss} />
      </div>

      <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
        <div class="tv-time-banner-icon" aria-hidden="true">
          <LogoMarkCircle />
        </div>
      </RenderFor>

      <div class="tv-time-banner-content">
        <h2 class="bold tv-time-banner-title">
          {m.tv_time_banner_heading()}
          <RenderFor audience="all" device={["tablet-sm", "mobile"]}>
            <LogoMarkCircle />
          </RenderFor>
        </h2>
        <p class="secondary">{m.tv_time_banner_description()}</p>
      </div>

      <BannerLink
        href={UrlBuilder.app.tvTime()}
        target="_blank"
        source={TV_TIME_BANNER_ID}
      >
        {m.tv_time_banner_action()}
      </BannerLink>
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
