<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import SparkleStarIcon from "$lib/components/icons/SparkleStarIcon.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import LogoMarkCircle from "$lib/components/logo/LogoMarkCircle.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import BannerContainer from "../_internal/BannerContainer.svelte";
  import DismissButton from "../_internal/DismissButton.svelte";
  import { useWelcomeBanner } from "./_internal/useWelcomeBanner.ts";

  const { isVisible, dismiss } = useWelcomeBanner();
</script>

{#if $isVisible}
  <BannerContainer>
    <section class="trakt-welcome-banner">
      <div class="welcome-banner-dismiss">
        <DismissButton onDismiss={dismiss} />
      </div>

      <div class="welcome-banner-main">
        <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
          <div class="welcome-banner-icon" aria-hidden="true">
            <LogoMarkCircle />
          </div>
        </RenderFor>

        <div class="welcome-banner-content">
          <h2 class="bold welcome-banner-title">
            {m.welcome_banner_heading()}
            <RenderFor audience="all" device={["tablet-sm", "mobile"]}>
              <LogoMarkCircle />
            </RenderFor>
          </h2>
          <p class="secondary">
            <MessageWithLink
              message={m.welcome_banner_description()}
              href={UrlBuilder.welcome()}
              target="_self"
            />
          </p>
        </div>

        <Button
          href={UrlBuilder.settings.data()}
          color="purple"
          variant="primary"
          style="flat"
          size="small"
          label={m.welcome_banner_action()}
        >
          {m.welcome_banner_action()}
        </Button>
      </div>

      <RenderFor audience="free">
        <div class="welcome-banner-upsell">
          <div class="upsell-lead">
            <span class="upsell-cue" aria-hidden="true">
              <SparkleStarIcon />
            </span>

            <div class="upsell-copy">
              <p class="bold">{m.welcome_vip_upsell_heading()}</p>
              <p class="secondary">
                {m.welcome_vip_upsell_description()}
              </p>
            </div>
          </div>

          <div class="upsell-cta">
            <GetVIPLink source="welcome-banner" />
          </div>
        </div>
      </RenderFor>
    </section>
  </BannerContainer>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-welcome-banner {
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
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

    /* Subtle purple wash in the corner, echoing the welcome / auth pages. */
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
      padding: var(--gap-l);
      padding-inline-end: var(--ni-48);
    }
  }

  .welcome-banner-main {
    position: relative;

    display: flex;
    align-items: center;
    gap: var(--gap-l);

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-m);
    }
  }

  .welcome-banner-dismiss {
    position: absolute;
    z-index: 1;

    top: var(--ni-8);
    inset-inline-end: var(--ni-8);
  }

  .welcome-banner-icon {
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

  .welcome-banner-content {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    flex: 1 1 auto;

    @include for-tablet-sm-and-below {
      gap: var(--gap-s);
    }
  }

  .welcome-banner-title {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .welcome-banner-upsell {
    position: relative;

    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding-block-start: var(--gap-s);
    border-block-start: var(--ni-1) solid
      color-mix(in srgb, var(--purple-500) 30%, transparent);
  }

  .upsell-lead {
    display: flex;
    align-items: center;
    gap: var(--gap-l);
    min-width: 0;

    flex: 1 1 auto;

    @include for-tablet-sm-and-below {
      gap: var(--gap-m);
    }
  }

  .upsell-cue {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: var(--ni-48);
    height: var(--ni-48);
    box-sizing: border-box;

    color: var(--color-foreground);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .upsell-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;

    flex: 1 1 auto;

    @include for-mobile {
      p {
        font-size: var(--font-size-text-small);
      }
    }
  }

  .upsell-cta {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
</style>
